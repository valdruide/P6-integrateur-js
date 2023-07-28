const admin = {
      init: function () {
            admin.adminBarGen();
      },
      adminBarGen: function () {
            const preHeader = document.getElementsByClassName('preHeader')[0];
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            if (!localStorage.token) {
                  loginBtn.style.display = 'block';
                  logoutBtn.style.display = 'none';
                  return;
            } else {
                  preHeader.style.display = 'flex';
                  loginBtn.style.display = 'none';
                  logoutBtn.style.display = 'block';

                  logoutBtn.addEventListener('click', () => {
                        localStorage.clear();
                        location.reload();
                  });

                  const editMode = document.getElementsByClassName('editMode')[0];
                  const modaleContainer = document.querySelector('.modaleContainer');
                  const modaleAddPhoto = document.querySelector('.modaleAddPhoto');
                  editMode.addEventListener('click', () => {
                        modaleContainer.showModal();
                        admin.getWorks();
                  });

                  const modale = document.querySelectorAll('.modale');
                  const closeModale = document.querySelectorAll('.fa-xmark');
                  for (let i = 0; i < closeModale.length; i++) {
                        closeModale[i].addEventListener('click', () => {
                              modaleContainer.close();
                              modaleAddPhoto.close();
                        });
                  }
            }
      },
      getWorks: async function () {
            modaleProjects = document.querySelector('.modaleProjects');
            modaleProjects.replaceChildren();
            try {
                  const response = await fetch('http://localhost:5678/api/works');
                  const works = await response.json();
                  for (work of works) {
                        const editImgContainer = document.createElement('div');
                        editImgContainer.classList.add('editImgContainer');
                        const img = document.createElement('img');
                        img.setAttribute('src', work.imageUrl);
                        img.setAttribute('alt', work.title);
                        editImgContainer.appendChild(img);
                        modaleProjects.appendChild(editImgContainer);

                        const editBtnsContainer = document.createElement('div');
                        editBtnsContainer.classList.add('editBtnsContainer');
                        editBtnsContainer.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right"></i> <i class="fa-solid fa-trash-can" id="trash"></i> ';
                        editImgContainer.appendChild(editBtnsContainer);

                        const editWorkBtn = document.createElement('p');
                        editWorkBtn.innerText = 'éditer';
                        editWorkBtn.setAttribute('id', 'edit' + work.id);
                        editWorkBtn.classList.add('editWorkBtn');
                        editImgContainer.appendChild(editWorkBtn);
                  }
            } catch (err) {
                  console.error(err);
            }
            document.getElementById('trash').addEventListener('click', () => {
                  console.log('SUPPRIMER');
            });
            document.querySelector('.addPhotoBtn').addEventListener('click', () => {
                  admin.addPhoto();
            });
      },
      addPhoto: function () {
            const modaleContainer = document.querySelector('.modaleContainer');
            const modaleAddPhoto = document.querySelector('.modaleAddPhoto');
            const arrowLeft = document.querySelectorAll('.fa-arrow-left')[1];
            arrowLeft.style.visibility = 'visible';
            modaleContainer.close();
            modaleAddPhoto.showModal();

            arrowLeft.addEventListener('click', () => {
                  modaleContainer.showModal();
                  modaleAddPhoto.close();
            });
      },
};

document.addEventListener('DOMContentLoaded', admin.init);
