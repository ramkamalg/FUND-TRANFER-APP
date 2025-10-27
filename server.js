require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data.sqlite');
const DEFAULT_SEED_PASSWORD = process.env.DEFAULT_SEED_PASSWORD || 'password';
const LOCALE = process.env.LOCALE || 'en-US';
const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'USD';

let currencyFormatter;
try {
  currencyFormatter = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: DEFAULT_CURRENCY });
} catch (err) {
  console.warn('Invalid locale or currency settings, falling back to en-US/USD');
  currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
}

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

// ensure database exists
const db = new sqlite3.Database(DB_FILE);

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT,
        balance REAL DEFAULT 0
      )`, err => err && reject(err));

      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user INTEGER,
        to_user INTEGER,
        to_account TEXT,
        amount REAL,
        type TEXT,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(from_user) REFERENCES users(id),
        FOREIGN KEY(to_user) REFERENCES users(id)
      )`, err => err && reject(err));

      db.get('SELECT COUNT(*) as cnt FROM users', (err, row) => {
        if (err) return reject(err);
        if (row.cnt === 0) {
          bcrypt.hash(DEFAULT_SEED_PASSWORD, 10).then(hash => {
            db.run('INSERT INTO users (username, email, password_hash, balance) VALUES (?,?,?,?)', ['alice','alice@example.com',hash,10000], (err) => {
              if (err) return reject(err);
              db.run('INSERT INTO users (username, email, password_hash, balance) VALUES (?,?,?,?)', ['bob','bob@example.com',hash,5000], (err) => {
                if (err) return reject(err);
                console.log(`Seeded demo users: alice / bob (password: ${DEFAULT_SEED_PASSWORD})`);
                resolve();
              });
            });
          }).catch(reject);
        } else {
          resolve();
        }
      });
    });
  });
}

const ready = initializeDatabase();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend
app.use(express.static(path.join(__dirname)));

function authMiddleware(req,res,next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({error:'missing auth'});
  const parts = auth.split(' ');
  if (parts.length!==2) return res.status(401).json({error:'bad auth'});
  const token = parts[1];
  jwt.verify(token, SECRET, (err, payload)=>{
    if (err) return res.status(401).json({error:'invalid token'});
    req.user = payload;
    next();
  })
}

app.post('/api/register', async (req,res)=>{
  const {username,email,password} = req.body;
  if (!username || !password) return res.status(400).json({error:'username and password required'});
  const hash = await bcrypt.hash(password,10);
  db.run('INSERT INTO users (username,email,password_hash,balance) VALUES (?,?,?,?)',[username,email||null,hash,0], function(err){
    if (err) return res.status(400).json({error: err.message});
    const id = this.lastID;
    const token = jwt.sign({id,username}, SECRET, {expiresIn:'7d'});
    res.json({token});
  });
});

app.post('/api/login', (req,res)=>{
  const {username,password} = req.body;
  if (!username || !password) return res.status(400).json({error:'username and password required'});
  db.get('SELECT * FROM users WHERE username = ? OR email = ?',[username,username], async (err,row)=>{
    if (err) return res.status(500).json({error:err.message});
    if (!row) return res.status(400).json({error:'invalid credentials'});
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(400).json({error:'invalid credentials'});
    const token = jwt.sign({id:row.id,username:row.username}, SECRET, {expiresIn:'7d'});
    res.json({token});
  });
});

app.get('/api/me', authMiddleware, (req,res)=>{
  const id = req.user.id;
  db.get('SELECT id,username,email,balance FROM users WHERE id = ?', [id], (err,row)=>{
    if (err) return res.status(500).json({error:err.message});
    res.json({user:row});
  });
});

app.post('/api/transfer', authMiddleware, (req,res)=>{
  const fromId = req.user.id;
  const {to_account,amount,note} = req.body;
  const amt = Number(amount);
  if (!to_account || !amt || amt<=0) return res.status(400).json({error:'invalid payload'});

  // find recipient by username or id
  db.get('SELECT * FROM users WHERE username = ? OR id = ?', [to_account,to_account], (err,recipient)=>{
    if (err) return res.status(500).json({error:err.message});
    if (!recipient) return res.status(400).json({error:'recipient not found'});
    // check sender balance
    db.get('SELECT balance FROM users WHERE id = ?', [fromId], (err,row)=>{
      if (err) return res.status(500).json({error:err.message});
      if (!row || row.balance < amt) return res.status(400).json({error:'insufficient balance'});

      db.run('BEGIN TRANSACTION', beginErr => {
        if (beginErr) return res.status(500).json({error: beginErr.message});

        db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amt, fromId], updateErr => {
          if (updateErr){
            db.run('ROLLBACK');
            return res.status(500).json({error:updateErr.message});
          }

          db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amt, recipient.id], creditErr => {
            if (creditErr){
              db.run('ROLLBACK');
              return res.status(500).json({error:creditErr.message});
            }

            db.run('INSERT INTO transactions (from_user,to_user,to_account,amount,type,note) VALUES (?,?,?,?,?,?)', [fromId, recipient.id, String(recipient.username), amt, 'transfer', note||null], function(err){
              if (err){
                db.run('ROLLBACK');
                return res.status(500).json({error:err.message});
              }
              const txId = this.lastID;
              db.run('COMMIT', commitErr => {
                if (commitErr){
                  db.run('ROLLBACK');
                  return res.status(500).json({error:commitErr.message});
                }

                db.get('SELECT balance FROM users WHERE id = ?', [fromId], (balErr, senderRow) => {
                  if (balErr) return res.status(500).json({error:balErr.message});
                  res.json({
                    ok: true,
                    txId,
                    balance: senderRow.balance,
                    balanceFormatted: formatCurrency(senderRow.balance)
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

app.get('/api/transactions', authMiddleware, (req,res)=>{
  const id = req.user.id;
  // return transactions with human-friendly usernames when possible
  db.all(`SELECT t.*, fu.username as from_username, tu.username as to_username
          FROM transactions t
          LEFT JOIN users fu ON fu.id = t.from_user
          LEFT JOIN users tu ON tu.id = t.to_user
          WHERE t.from_user = ? OR t.to_user = ?
          ORDER BY t.created_at DESC`, [id,id], (err,rows)=>{
    if (err) return res.status(500).json({error:err.message});
    const formatted = rows.map(row => {
      const outgoing = row.from_user === id;
      const counterpartyName = outgoing ? (row.to_username || row.to_account) : (row.from_username || row.to_account);
      return {
        id: row.id,
        amount: row.amount,
        amountFormatted: formatCurrency(row.amount),
        direction: outgoing ? 'outgoing' : 'incoming',
        counterparty: counterpartyName,
        counterpartyId: outgoing ? row.to_user : row.from_user,
        type: row.type,
        note: row.note,
        createdAt: row.created_at,
        createdAtISO: new Date(row.created_at).toISOString(),
        balanceDelta: outgoing ? -row.amount : row.amount
      };
    });
    res.json({transactions:formatted});
  });
});

// lookup user by username or id
app.get('/api/users/:identifier', authMiddleware, (req,res)=>{
  const ident = req.params.identifier;
  db.get('SELECT id,username,email,balance FROM users WHERE username = ? OR id = ?', [ident,ident], (err,row)=>{
    if (err) return res.status(500).json({error:err.message});
    if (!row) return res.status(404).json({error:'user not found'});
    res.json({user:row});
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  ready.then(() => {
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  }).catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

module.exports = { app, db, ready };
