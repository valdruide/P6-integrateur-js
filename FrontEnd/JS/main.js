const indexPage = {
  init: function () {
    indexPage.getCat();
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
        const filterTxt = document.createElement('p')
        filterTxt.innerText = cat.name
        filterTxt.setAttribute('id', cat.id)
        filter.appendChild(filterTxt)
        filterContainer.appendChild(filter)

      }
  }
};

document.addEventListener("DOMContentLoaded", indexPage.init);
