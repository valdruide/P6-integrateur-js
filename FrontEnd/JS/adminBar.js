let workDeleted = false;
let workAdded = false;
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
                  const firstModale = document.getElementById('firstModale');
                  const modaleAddPhoto = document.getElementById('secondModale');
                  editMode.addEventListener('click', () => {
                        modaleContainer.showModal();
                        admin.getWorks();
                  });

                  const closeModale = document.querySelectorAll('.fa-xmark');
                  const arrowLeft = document.getElementById('fa-arrow-left');
                  for (let i = 0; i < closeModale.length; i++) {
                        closeModale[i].addEventListener('click', () => {
                              if (workDeleted) {
                                    workDeleted = false;
                                    location.reload();
                              } else if (workAdded) {
                                    workAdded = false;
                                    location.reload();
                              } else {
                                    admin.removePhoto();
                                    arrowLeft.style.visibility = 'hidden';
                                    modaleAddPhoto.style.display = 'none';
                                    firstModale.style.display = 'block';
                                    modaleContainer.close();
                              }
                        });
                        modaleContainer.addEventListener('mousedown', (event) => {
                              if (event.button == 0) {
                                    if (workDeleted) {
                                          workDeleted = false;
                                          location.reload();
                                    } else if (workAdded) {
                                          workAdded = false;
                                          location.reload();
                                    } else {
                                          admin.removePhoto();
                                          arrowLeft.style.visibility = 'hidden';
                                          modaleAddPhoto.style.display = 'none';
                                          firstModale.style.display = 'block';
                                          modaleContainer.close();
                                    }
                              }
                        });
                        const modaleWrapper = document.getElementById('modaleWrapper');
                        modaleWrapper.addEventListener('mousedown', (event) => event.stopPropagation());
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

                        const trash = document.createElement('i');
                        trash.classList.add('fa-solid', 'fa-trash-can');
                        trash.setAttribute('id', work.id);
                        editBtnsContainer.appendChild(trash);
                        editImgContainer.appendChild(editBtnsContainer);
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
            // const modaleContainer = document.getElementById('firstModale');
            const firstModale = document.getElementById('firstModale');
            const modaleAddPhoto = document.getElementById('secondModale');
            const arrowLeft = document.getElementById('fa-arrow-left');
            arrowLeft.style.visibility = 'visible';
            modaleAddPhoto.style.display = 'block';
            firstModale.style.display = 'none';

            arrowLeft.addEventListener('click', () => {
                  arrowLeft.style.visibility = 'hidden';
                  modaleAddPhoto.style.display = 'none';
                  firstModale.style.display = 'block';
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
                  e.stopImmediatePropagation();
                  let pic = document.getElementById('photo');
                  let title = document.getElementById('titre');
                  let categoryId = document.getElementById('categorie');

                  const token = localStorage.getItem('token');

                  if (pic === undefined || title === '' || categoryId === '') {
                        return alert('Veuillez remplir tous les champs');
                  } else {
                        try {
                              const formData = new FormData();
                              formData.append('title', title.value);
                              formData.append('category', categoryId.value);
                              formData.append('image', pic.files[0]);
                              const response = await fetch('http://localhost:5678/api/works', {
                                    method: 'POST',
                                    headers: {
                                          Authorization: `Bearer ${token}`,
                                    },
                                    body: formData,
                              });
                              if (response.status === 201) {
                                    arrowLeft.style.visibility = 'hidden';
                                    modaleAddPhoto.style.display = 'none';
                                    firstModale.style.display = 'block';
                                    pic.value = null;
                                    title = '';
                                    categoryId = 1;
                                    workAdded = true;
                                    admin.removePhoto();
                                    admin.getWorks();
                                    alert('Projet ajouté avec succès');
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
      removePhoto: function () {
            const inputSubmitBtn = document.getElementById('submitBtn');
            const imgPreview = document.querySelector('.previewImg');
            const addPhotoTxt = document.querySelector('#addPhotoTxt');
            const imageIcon = document.querySelector('.fa-image');
            imgPreview.setAttribute('src', '');
            imgPreview.style.display = 'none';
            addPhotoTxt.innerText = '+ Ajouter une photo';
            imageIcon.style.display = 'block';
            inputSubmitBtn.classList.add('importProjectBtn');

            let pic = document.getElementById('photo');
            let title = document.getElementById('titre');
            let categoryId = document.getElementById('categorie');
            pic.value = null;
            title.value = '';
            categoryId.value = 1;
      },
};

document.addEventListener('DOMContentLoaded', admin.init);
