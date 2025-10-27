const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const DB_FILE = path.join(__dirname, 'data.sqlite');

// ensure database exists
const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    balance REAL DEFAULT 0
  )`);

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
  )`);

  // seed demo user if none
  db.get('SELECT COUNT(*) as cnt FROM users', (err, row) => {
    if (err) return console.error(err);
    if (row.cnt === 0) {
      const pw = 'password';
      bcrypt.hash(pw, 10).then(hash => {
        db.run('INSERT INTO users (username, email, password_hash, balance) VALUES (?,?,?,?)', ['alice','alice@example.com',hash,10000]);
        db.run('INSERT INTO users (username, email, password_hash, balance) VALUES (?,?,?,?)', ['bob','bob@example.com',hash,5000]);
        console.log('Seeded demo users: alice / bob (password: password)');
      });
    }
  });
});

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

  db.serialize(()=>{
    // find recipient by username or id
    db.get('SELECT * FROM users WHERE username = ? OR id = ?', [to_account,to_account], (err,recipient)=>{
      if (err) return res.status(500).json({error:err.message});
      if (!recipient) return res.status(400).json({error:'recipient not found'});
      // check sender balance
      db.get('SELECT balance FROM users WHERE id = ?', [fromId], (err,row)=>{
        if (err) return res.status(500).json({error:err.message});
        if (!row || row.balance < amt) return res.status(400).json({error:'insufficient balance'});
        // perform transfer inside transaction
        db.run('BEGIN TRANSACTION');
        db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amt, fromId]);
        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amt, recipient.id]);
        db.run('INSERT INTO transactions (from_user,to_user,to_account,amount,type,note) VALUES (?,?,?,?,?,?)', [fromId, recipient.id, String(recipient.username), amt, 'transfer', note||null], function(err){
          if (err){ db.run('ROLLBACK'); return res.status(500).json({error:err.message}); }
          db.run('COMMIT');
          res.json({ok:true,txId:this.lastID});
        });
      });
    });
  });
});

app.get('/api/transactions', authMiddleware, (req,res)=>{
  const id = req.user.id;
  db.all('SELECT * FROM transactions WHERE from_user = ? OR to_user = ? ORDER BY created_at DESC', [id,id], (err,rows)=>{
    if (err) return res.status(500).json({error:err.message});
    res.json({transactions:rows});
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
