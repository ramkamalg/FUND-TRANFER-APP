// Login handler for Fund Transfer App
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Login failed');
      // store token and redirect
      localStorage.setItem('ft_token', data.token);
      window.location.href = 'Record.html';
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
}

// Registration handler
const regForm = document.getElementById('register-form');
if (regForm){
  regForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const username = document.getElementById('reg_username').value;
    const email = document.getElementById('reg_email').value;
    const password = document.getElementById('reg_password').value;
    try{
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username,email,password})
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Registration failed');
      localStorage.setItem('ft_token', data.token);
      window.location.href = 'Record.html';
    }catch(e){ console.error(e); alert('Network error'); }
  });
}

// optional logout helper for other pages
function logout(){
  localStorage.removeItem('ft_token');
  window.location.href = 'loginpage.html';
}

// expose logout for Record page to call
window.ftLogout = logout;
