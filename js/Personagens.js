import * as advFilter from "./toggleModal.js";

export class Router{
}
//classe para buscar e tratar os dados
export class Characters{
  characters = []
  root
  routes = {};
  constructor(root){
    this.root = document.querySelector(root);
    this.load();
    this.addRoute("/", "../pages/home.html");
    this.addRoute("/charDetails", "../pages/charDetails.html");
    window.onpopstate = () => this.handlePage();
    //this.realoadOnCharDetails();
  }

  addRoute(page, href){
    this.routes[page] = href;
  }

  route(href, char){
    window.history.pushState({}, "", href);

    this.handlePage(char);
  }

  handlePage(char){
    const { pathname } = window.location;
    const route = this.routes[pathname];
    //console.log(route);

    if(pathname === "/"){
      fetch(route).then(data => data.text()).then(html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
        this.update(this.characters);
        advFilter.openAdvancedFilter();
        advFilter.closeAdvancedFilters();
        this.filterByName();
        this.creatDataOptions(this.characters);
        this.filterElementsMobile();
        this.filterElementsDesk();
      });
    } else{
      fetch(route).then(data => data.text()).then(html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
        //console.log(html)
        this.changeElementsDetails(char);
      });
    }

  }

  /*realoadOnCharDetails(){
    window.addEventListener("beforeunload", (event) => {
      const teste = function () {
        window.location.href = "/";
      }
      window.location.replace(teste);
    })
  }*/

  changeElementsDetails(character){
    document.querySelector('.details-img img').src = `${character.image}`;
    document.querySelector('.details-img img').alt = `Imagem de ${character.name}`;
    document.querySelector('.char-name span').textContent = `${character.name}`;
    document.querySelector('.informations .infoGender').textContent = `${character.gender}`;
    document.querySelector('.informations .infoStatus').textContent = `${character.status}`;
    document.querySelector('.informations .infoSpecie').textContent = `${character.species}`;
  }

  async showCharacters(){
    try{
      const resp = await fetch("https://rickandmortyapi.com/api/character");
      const respConvertida = await resp.json();
      const { results } = await respConvertida;

      return results;
    } catch(error) {
      alert("Não foi possível carregar a página");
    }
  }

  async load(){
    this.characters = await this.showCharacters();
    this.handlePage();
    //this.creatDataOptions(this.characters);
    /*this.characters.forEach(character => {
      console.log(character.status)
    })*/
  }
}

//classe para manipular o HTML
export class CharactersView extends Characters{
  constructor(root){
    super(root);
    //this.filterByName();
    //this.filterElementsDesk();
    //this.filterElementsMobile();
  }

  update(characters){
    const cardsContainer = this.root.querySelector('.cards-wrapper .cards-content');
    cardsContainer.innerHTML = '';
    characters.forEach(character => {
      cardsContainer.innerHTML += `
        <div class="card-personagem">
          <div class="personagem-img" href="/charDetails">
            <img src="${character.image}" alt="Imagem de ${character.name}">
          </div>
          <div class="personagem-info">
            <p class="nome">${character.name}</p>
            <span class="specie">${character.species}</span>
          </div>
        </div>
      `
    });

    const elementsDetails = this.root.querySelectorAll('.card-personagem .personagem-img');
    this.charDetails(elementsDetails);
  }

  filterByName(){
    const inName = this.root.querySelector('#byName');
    inName.addEventListener("blur", (e) => {
      e.preventDefault();
      const characterName = e.target.value;

      const charFilByName = this.characters
        .filter(character => character.name === characterName);
      
      console.log(charFilByName)
      this.update(charFilByName);
    });
  }

  filterElementsDesk(){
    const inSpecie = this.root.querySelector('#formDesk');

    inSpecie.addEventListener("change", (e) => {
      const termFill = e.target.dataset.fill;
      const elementsFill = this.characters
      .filter(character => character[termFill] === e.target.value);
      this.update(elementsFill);
    });
  }

  filterElementsMobile(){
    const formMobal = this.root.querySelector('.modal-filter-content form');

    formMobal.addEventListener("submit", (e) => {
      e.preventDefault();

      const valoresSelect = {};

      for(let element of formMobal.elements){
        if(element.tagName === 'SELECT') {
          valoresSelect[element.name] = element.value;
        }
      }

      const charactersFill = this.characters.filter(character => {
        return character.species === valoresSelect.species &&
               character.gender === valoresSelect.gender &&
               character.status === valoresSelect.status 
      });
      this.update(charactersFill);

      this.root.querySelector('#app .modal-filters').style.display = 'none';
    });
  }

  creatDataOptions(characters){
    const dataList = this.root.querySelector('.filters datalist');
    
    characters.forEach(character => {
      const option = document.createElement('option');
      option.value = `${character.name}`;

      dataList.appendChild(option);
    });
  }

  charDetails(elementsDetails){
    elementsDetails.forEach(element => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        const { parentNode } = e.target;
        const href = parentNode.attributes.href.value;
        const { nextElementSibling } = parentNode;
        const charName = nextElementSibling.querySelector('p').textContent;

        const char = this.characters.find(char => char.name === charName);

        this.route(href, char);
      })
    })
  }

  changeCharDetails(character){
    //console.log(character)
    this.root.querySelector('.details-img img').src = `${character.image}`;
    this.root.querySelector('.details-img img').alt = `Imagem de ${character.name}`;
    this.root.querySelector('.char-name span').textContent = `${character.name}`;
    this.root.querySelector('.informations .infoGender').textContent = `${character.gender}`;
    this.root.querySelector('.informations .infoStatus').textContent = `${character.status}`;
    this.root.querySelector('.informations .infoSpecie').textContent = `${character.species}`;
  }

  /*handlePage(char){
    //const { pathname } = window.location;
    //const route = this.routes[pathname];

    fetch(route).then(data => data.text()).then(html => {
      this.root.querySelector('#container').innerHTML = '';
      this.root.querySelector('#container').innerHTML = html;
      this.changeCharDetails(char);
    })
  }*/
}