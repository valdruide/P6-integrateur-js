let workDeleted = false;
const admin = {
      init: async function () {
            admin.adminBarGen();
            //Récupère toutes les catégories pour  la modale
            const category = document.getElementById('categorie');
            try {
                  const response = await fetch('http://localhost:5678/api/categories');
                  const res = await response.json();
                  for (cat of res) {
                        const option = document.createElement('option');
                        option.setAttribute('value', cat.id);
                        option.innerText = cat.name;
                        category.appendChild(option);
                  }
            } catch (err) {
                  console.error(err);
            }
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
                              if (workDeleted) {
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

                        const moveArrow = document.createElement('i');
                        const trash = document.createElement('i');
                        moveArrow.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
                        trash.classList.add('fa-solid', 'fa-trash-can');
                        trash.setAttribute('id', work.id);
                        editBtnsContainer.appendChild(moveArrow);
                        editBtnsContainer.appendChild(trash);
                        editImgContainer.appendChild(editBtnsContainer);

                        const editWorkBtn = document.createElement('p');
                        editWorkBtn.innerText = 'éditer';
                        editWorkBtn.classList.add('editWorkBtn');
                        editImgContainer.appendChild(editWorkBtn);
                  }
            } catch (err) {
                  console.error(err);
            }

            let deleteBtn = document.querySelectorAll('.fa-trash-can');
            for (let i = 0; i < deleteBtn.length; i++) {
                  deleteBtn[i].addEventListener('click', () => {
                        admin.removeProject(deleteBtn[i]);
                  });
            }
            document.querySelector('.addPhotoBtn').addEventListener('click', () => {
                  admin.addPhoto();
            });
      },
      removeProject: async function (btnID) {
            console.log(btnID.id);
            const token = localStorage.getItem('token');
            try {
                  const response = await fetch('http://localhost:5678/api/works/' + btnID.id, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                  });
                  if (response.status === 204) {
                        workDeleted = true;
                        admin.getWorks();
                  } else if (response.status === 401) {
                        console.log('Non autorisé');
                  } else {
                        console.log('erreur');
                  }
            } catch (err) {
                  console.error(err);
            }
      },
      addPhoto: async function () {
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

            //Preview de la photo
            const addPhotoInput = document.getElementById('photo');
            addPhotoInput.onchange = () => {
                  if (addPhotoInput.files.length > 0) {
                        const inputSubmitBtn = document.getElementById('submitBtn');
                        const imgPreview = document.querySelector('.previewImg');
                        const addPhotoTxt = document.querySelector('#addPhotoTxt');
                        const imageIcon = document.querySelector('.fa-image');
                        const src = URL.createObjectURL(addPhotoInput.files[0]);
                        imgPreview.setAttribute('src', src);
                        imgPreview.style.display = 'block';
                        addPhotoTxt.innerText = 'Changer la photo';
                        imageIcon.style.display = 'none';
                        inputSubmitBtn.classList.add('importProjectBtn');
                  }
            };

            //Submit btn
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.addEventListener('click', async (e) => {
                  e.preventDefault();
                  const pic = document.getElementById('photo').files[0];
                  const title = document.getElementById('titre').value;
                  const categoryId = document.getElementById('categorie').value;

                  const token = localStorage.getItem('token');

                  if (pic === undefined || title === '' || categoryId === '') {
                        return alert('Veuillez remplir tous les champs');
                  } else {
                        try {
                              const formData = new FormData();
                              formData.append('title', title);
                              formData.append('category', categoryId);
                              formData.append('image', pic);
                              const response = await fetch('http://localhost:5678/api/works', {
                                    method: 'POST',
                                    headers: {
                                          Authorization: `Bearer ${token}`,
                                    },
                                    body: formData,
                              });

                              if (response.status === 201) {
                                    admin.getWorks();
                                    arrowLeft.style.visibility = 'hidden';
                                    modaleContainer.showModal();
                                    modaleAddPhoto.close();
                                    alert('Projet ajouté avec succès');
                                    formData.clear(); //A TESTER ////////////////////////////////////////////////////////////////////
                              } else if (response.status === 500) {
                                    console.log('Une erreur est survenue. Contactez votre administrateur système');
                              } else if (response.status === 401) {
                                    alert("Vous n'avez pas l'autorisation nécessaire. Si vous êtes administrateur, déconnectez et reconnectez-vous !");
                              }
                        } catch (err) {
                              console.error(err);
                        }
                  }
            });
      },
};

document.addEventListener('DOMContentLoaded', admin.init);
