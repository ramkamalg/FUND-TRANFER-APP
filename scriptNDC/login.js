// Login handler for Fund Transfer App
document.getElementById('login-form').addEventListener('submit', async (e) => {
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
