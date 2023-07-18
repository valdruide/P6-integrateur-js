const indexPage = {
  init: function () {
    indexPage.getCat();
    indexPage.getWorks();
  },
  getCat: async function () {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const res = await response.json();
      indexPage.displayCat(res)
      
    } catch (err) {
      console.error(err);
    }
  },
  displayCat: function (res) {
    const filterContainer = document.getElementById('filterContainer')

      for(cat of res){
        const filter = document.createElement('div')
        filter.classList.add('filter')
        filter.setAttribute('id', cat.id)
        const filterTxt = document.createElement('p')
        filterTxt.innerText = cat.name
        filter.appendChild(filterTxt)
        filterContainer.appendChild(filter)
      }
      const filter = document.querySelectorAll('.filter');
      let previousFilter = filter[0];
      for(let i = 0; i < filter.length; i++){
        filter[i].addEventListener('click', () => {
            previousFilter.classList.remove('activeFilter')
            previousFilter = filter[i];
            filter[i].classList.add('activeFilter');
            console.log('cliock');
        })
      }
  },
  getWorks: async function(){
    try{
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        indexPage.displayWorks(works)
    } catch (err){
        console.error(err);
    }
  },
  displayWorks: function (works){
    const worksContainer = document.getElementById('gallery');

    for(work of works){
        const figure = document.createElement('figure');
        figure.setAttribute('categoryId', work.categoryId);
        const img = document.createElement('img');
        img.setAttribute('src', work.imageUrl);
        img.setAttribute('alt', work.title);
        const figcaption = document.createElement('figcaption');
        figcaption.innerText = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        worksContainer.appendChild(figure);
    }
  }
};

document.addEventListener("DOMContentLoaded", indexPage.init);
