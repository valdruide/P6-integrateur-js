
let workDeleted = false;
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

                  const closeModale = document.querySelectorAll('.fa-xmark');
                  for (let i = 0; i < closeModale.length; i++) {
                        closeModale[i].addEventListener('click', () => {
                              if(workDeleted){
                                    workDeleted = false;
                                    location.reload();
                              }
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
                        img.setAttribute('id', work.id);
                        editImgContainer.appendChild(img);
                        modaleProjects.appendChild(editImgContainer);

                        const editBtnsContainer = document.createElement('div');
                        editBtnsContainer.classList.add('editBtnsContainer');

                        const moveArrow = document.createElement('i')
                        const trash = document.createElement('i')
                        moveArrow.classList.add('fa-solid', 'fa-arrows-up-down-left-right')
                        trash.classList.add('fa-solid', 'fa-trash-can')
                        trash.setAttribute('id', work.id)
                        editBtnsContainer.appendChild(moveArrow)
                        editBtnsContainer.appendChild(trash)
                        editImgContainer.appendChild(editBtnsContainer);

                        const editWorkBtn = document.createElement('p');
                        editWorkBtn.innerText = 'éditer';
                        editWorkBtn.classList.add('editWorkBtn');
                        editImgContainer.appendChild(editWorkBtn);
                  }
            } catch (err) {
                  console.error(err);
            }

            let deleteBtn = document.querySelectorAll(".fa-trash-can");
            for(let i = 0; i < deleteBtn.length; i++){
                  deleteBtn[i].addEventListener('click', () => { 
                        admin.removeProject(deleteBtn[i]);
                  });
            }
            document.querySelector('.addPhotoBtn').addEventListener('click', () => {
                  admin.addPhoto();
            });
      },
      removeProject: async function(btnID){
            console.log(btnID.id)
            const token = localStorage.getItem("token");
            try{
                  const response = await fetch('http://localhost:5678/api/works/' + btnID.id, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}`},
                  });
                  if(response.status === 204){
                        workDeleted = true;
                        admin.getWorks()
                  } else if(response.status === 401){
                        console.log('Non autorisé')
                  } else {
                        console.log('erreur')
                  }

            }  catch (err) {
                  console.error(err)
            }

      },
      addPhoto: function () {
            const modaleContainer = document.querySelector('.modaleContainer');
            const modaleAddPhoto = document.querySelector('.modaleAddPhoto');
            const arrowLeft = document.querySelectorAll('.fa-arrow-left')[1];
            arrowLeft.style.visibility = 'visible';
            modaleContainer.close();
            modaleAddPhoto.showModal();
            console.log('add photo')

            arrowLeft.addEventListener('click', () => {
                  modaleContainer.showModal();
                  modaleAddPhoto.close();
            });
      },
};

document.addEventListener('DOMContentLoaded', admin.init);
