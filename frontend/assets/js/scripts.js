document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.user.role === 'admin') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'student.html';
    }
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}); 