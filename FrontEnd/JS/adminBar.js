const admin = {
    init: function(){
        admin.adminBarGen();
    },
    adminBarGen: function(){
        const preHeader = document.getElementsByClassName('preHeader')[0];
        const loginBtn = document.getElementById('loginBtn')
        const logoutBtn = document.getElementById('logoutBtn')
        if(!localStorage.token){
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            return
        } else {
            preHeader.style.display = 'flex';
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';

            logoutBtn.addEventListener('click', () => {
                localStorage.clear();
                location.reload();
            })

            const editMode = document.getElementsByClassName('editMode')[0];
            const dialog = document.querySelector('dialog');
            editMode.addEventListener('click', () => {
                dialog.showModal();
                admin.getWorks()
            })

            const closeModale = document.getElementById('closeModale');
            closeModale.addEventListener('click', () => {
                dialog.close()
            })

            
        }
    },
    getWorks: async function(){
        modaleProjects = document.querySelector('.modaleProjects');
        try {
            const response = await fetch('http://localhost:5678/api/works');
            const works = await response.json();
            for (work of works) {
                const img = document.createElement('img');
                img.setAttribute('src', work.imageUrl);
                img.setAttribute('alt', work.title);
                modaleProjects.appendChild(img);
          }
        } catch (err) {
            console.error(err);
        }
    }
}


document.addEventListener('DOMContentLoaded', admin.init);