const indexPage = {
      init: function () {
            indexPage.getCat();
            indexPage.getWorks();
      },
      getCat: async function () {
            //Récupère toutes les catégories
            try {
                  const response = await fetch('http://localhost:5678/api/categories');
                  const res = await response.json();
                  indexPage.displayCat(res); //Lance la fonction displayCat avec en paramètre les résultats du fetch
            } catch (err) {
                  console.error(err);
            }
      },
      displayCat: function (res) {
            //Affiche les filtres
            const filterContainer = document.getElementById('filterContainer');
            for (cat of res) {
                  const filter = document.createElement('div');
                  filter.classList.add('filter');
                  filter.setAttribute('id', cat.id);
                  const filterTxt = document.createElement('p');
                  filterTxt.innerText = cat.name;
                  filter.appendChild(filterTxt);
                  filterContainer.appendChild(filter);
            }
            //ajoute un click event sur chaque flitres
            const filter = document.querySelectorAll('.filter');
            for (let i = 0; i < filter.length; i++) {
                  filter[i].addEventListener('click', () => {
                        //Supprime la classe activeFilter de tous les filtres avant de le mettre sur celui cliqué
                        filter.forEach((filter) => {
                              filter.classList.remove('activeFilter');
                        });
                        indexPage.filterCat(filter[i]);
                  });
            }
      },
      filterCat: function (filter) {
            //Ajoute la classe activeFilter sur le filtre cliqué
            filter.classList.add('activeFilter');
            //Affiche ou masque les travaux en fonction du filtre
            let catId = filter.getAttribute('id');
            let allWorks = document.querySelectorAll('.workFigure');
            for (let i = 0; i < allWorks.length; i++) {
                  if (catId !== allWorks[i].getAttribute('categoryId') && catId !== '0') {
                        allWorks[i].style.display = 'none';
                  } else {
                        allWorks[i].style.display = 'block';
                  }
            }
      },
      getWorks: async function () {
            //récupère tous les travaux
            try {
                  const response = await fetch('http://localhost:5678/api/works');
                  const works = await response.json();
                  indexPage.displayWorks(works);
            } catch (err) {
                  console.error(err);
            }
      },
      displayWorks: function (works) {
            //Affiche tous les travaux
            const worksContainer = document.getElementById('gallery');
            for (work of works) {
                  const figure = document.createElement('figure');
                  figure.setAttribute('categoryId', work.categoryId);
                  figure.classList.add('workFigure');
                  const img = document.createElement('img');
                  img.setAttribute('src', work.imageUrl);
                  img.setAttribute('alt', work.title);
                  const figcaption = document.createElement('figcaption');
                  figcaption.innerText = work.title;
                  figure.appendChild(img);
                  figure.appendChild(figcaption);
                  worksContainer.appendChild(figure);
            }
      },
};

document.addEventListener('DOMContentLoaded', indexPage.init);
