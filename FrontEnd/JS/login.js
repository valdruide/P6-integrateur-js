const login = {
      init: function () {
            const loginBtn = document.getElementById('loginBtn');
            loginBtn.addEventListener('click', (e) => {
                  e.preventDefault();
                  login.login();
            });
      },
      login: async function () {
            const mail = document.getElementById('mail').value;
            const pass = document.getElementById('pass').value;
            const errorMsg = document.querySelector('.errorMsg');
            errorMsg.style.visibility = 'hidden';
            errorMsg.classList.remove('errorAnim');
            const user = {
                  email: mail,
                  password: pass,
            };
            try {
                  const result = await fetch('http://localhost:5678/api/users/login', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user),
                  });
                  const res = await result.json();
                  console.log(res);
                  if (res.message || res.error) {
                        errorMsg.style.visibility = 'visible';
                        errorMsg.classList.add('errorAnim');
                  } else {
                        const token = res.token;
                        localStorage.setItem('token', token);
                        window.location.href = 'index.html';
                  }
            } catch (err) {
                  console.error(err);
            }
      },
};

document.addEventListener('DOMContentLoaded', login.init);
