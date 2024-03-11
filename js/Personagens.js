import * as advFilter from "./toggleModal.js";
import { CharactersData } from "./CharactersData.js";
import { Router } from "./Router.js";

export class Characters extends Router{
  characters = [];
  locations = [];
  routes = {};
  root;
  constructor(){
    super();
    //this.addRoute("/", "../pages/home.html");
    //this.addRoute("/charDetails", "../pages/charDetails.html");
    //this.addRoute("/locations", "../pages/locations.html");
    
    this.load();
    //window.onpopstate = () => this.handlePage();
    //this.realoadOnCharDetails();
  }

  async load(){
    this.characters = await CharactersData.getCharacters();
    
    this.locations = await CharactersData.getLocations();
    //this.handlePage();
  }

  update(data){}

  static creatDataOptions(data){
    const dataList = document.querySelector('.filters datalist');
    
    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.name}`;

      dataList.appendChild(option);
    });
  }

  /*addRoute(page, href){
    this.routes[page] = href;
  }*/

  /*handlePage(char){
    const { pathname } = window.location;
    const route = this.routes[pathname];

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
    } else if(pathname === "/locations"){
      fetch(route).then(data => data.text()).then(html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

      });
    } else {
      fetch(route).then(data => data.text()).then(html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
        this.changeElementsDetails(char);
      });
    }

  }*/

  /*route(href, char){
    window.history.pushState({}, "", href);

    this.handlePage(char);
  }*/

  

  //filterByName(){};

  //creatDataOptions(){};

  /*realoadOnCharDetails(){
    window.addEventListener("beforeunload", (event) => {
      const teste = function () {
        window.location.href = "/";
      }
      window.location.replace(teste);
    })
  }*/
}

//classe para manipular o HTML
export class CharactersView extends Characters{
  constructor(root){
    super();
    this.root = document.querySelector(root);
    //this.clickNavDesk();
  }

  static update(characters){
    const cardsContainer = document.querySelector('.cards-wrapper .cards-content');
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

    const elementsDetails = document.querySelectorAll('.card-personagem .personagem-img');
    CharactersView.charDetails(elementsDetails);
  }

  static async charDetails(elementsDetails){
    elementsDetails.forEach(element => {
      element.addEventListener("click", async (e) => {
        const { parentNode } = e.target;
        const href = parentNode.attributes.href.value;
        const { nextElementSibling } = parentNode;
        const charName = nextElementSibling.querySelector('p').textContent;

        const characters = await CharactersData.getCharacters();
        const char = characters.find(char => char.name === charName);

        Router.route(href, char);
      });
    });
  }

  static changeElementsDetails(character){
    const teste = new CharactersView("#app");
    teste.goBackHome();
    //this.goBackHome();
    document.querySelector('.details-img img').src = `${character.image}`;
    document.querySelector('.details-img img').alt = `Imagem de ${character.name}`;
    document.querySelector('.char-name span').textContent = `${character.name}`;
    document.querySelector('.informations .infoGender').textContent = `${character.gender}`;
    document.querySelector('.informations .infoStatus').textContent = `${character.status}`;
    document.querySelector('.informations .infoSpecie').textContent = `${character.species}`;
  }

  static filterByName(data){
    console.log(data);
    const inName = document.querySelector('#byName');
    inName.addEventListener("blur", (e) => {
      e.preventDefault();
      const characterName = e.target.value;

      const charFilByName = data.filter(character => character.name === characterName);
      
      this.update(charFilByName);
    });
  }

  static filterElementsMobile(data){
    const formMobal = document.querySelector('.modal-filter-content form');

    formMobal.addEventListener("submit", (e) => {
      e.preventDefault();

      const valoresSelect = {};

      for(let element of formMobal.elements){
        if(element.tagName === 'SELECT') {
          valoresSelect[element.name] = element.value;
        }
      }

      const charactersFill = data.filter(data => {
        return data.species === valoresSelect.species &&
               data.gender === valoresSelect.gender &&
               data.status === valoresSelect.status 
      });
      this.update(charactersFill);

      document.querySelector('#app .modal-filters').style.display = 'none';
    });
  }

  static filterElementsDesk(data){
    const inSpecie = document.querySelector('#formDesk');

    inSpecie.addEventListener("change", (e) => {
      const termFill = e.target.dataset.fill;
      const elementsFill = data.filter(data => data[termFill] === e.target.value);
      
      this.update(elementsFill);
    });
  }

  /*changeCharDetails(character){
    //console.log(character)
    this.root.querySelector('.details-img img').src = `${character.image}`;
    this.root.querySelector('.details-img img').alt = `Imagem de ${character.name}`;
    this.root.querySelector('.char-name span').textContent = `${character.name}`;
    this.root.querySelector('.informations .infoGender').textContent = `${character.gender}`;
    this.root.querySelector('.informations .infoStatus').textContent = `${character.status}`;
    this.root.querySelector('.informations .infoSpecie').textContent = `${character.species}`;
  }

  

  clickNavDesk(){
    const btnLink = document.querySelectorAll("[data-link]");
    btnLink.forEach(btn => {
      btn.addEventListener("click", (event) => {
        //event.preventDefault();
        const href = event.target.attributes.href.value;
        this.route(href, null);
      });
    });
  }*/

  goBackHome(){
    const btn = this.root.querySelector('.btn-go-back span');
    btn.addEventListener("click", (event) => {
      Router.route("/", null);
    });
  }
}

export class LocationsView extends Characters{
  static update(data){
    document.querySelector('.locations-content').innerHTML = '';
    data.forEach(location => {
      document.querySelector('.locations-content').innerHTML += `
        <div class="card-location">
          <p class="location-nome" href="/locationsDetails">${location.name}</p>
          <span class="location-type">${location.type}</span>
        </div>
      `
    });

    const elementsDetails = document.querySelectorAll('.location-nome');
    LocationsView.locationDetails(elementsDetails);
  }

  static async locationDetails(elementsDetails){
    elementsDetails.forEach(element => {
      element.addEventListener("click", async (e) => {
        const locationName = e.target.textContent;
        const href = e.target.attributes.href.value;
        const locations = await CharactersData.getLocations();

        const location = locations.filter(location => location.name === locationName);
        
        Router.route(href, location);
      });
    });
  }

  static creatDataOptions(data){
    const dataList = document.querySelector('.filters datalist');

    const inTypeMob = document.querySelector('form #type');
    const inDimensionMob = document.querySelector('form #dimension');
    
    const inTypeDesk = document.querySelector('#inType');
    const inDimensionDesk = document.querySelector('#inDimension');
    
    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.name}`;

      dataList.appendChild(option);
    });

    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.type}`;
      option.textContent = `${data.type}`;

      inTypeMob.appendChild(option);
    });

    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.type}`;
      option.textContent = `${data.type}`;

      inTypeDesk.appendChild(option);
    });

    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.dimension}`;
      option.textContent = `${data.dimension}`;

      inDimensionMob.appendChild(option);
    });

    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.dimension}`;
      option.textContent = `${data.dimension}`;

      inDimensionDesk.appendChild(option);
    });
  }

  static filterByName(data){
    console.log(data);
    const inName = document.querySelector('#byName');
    inName.addEventListener("blur", (e) => {
      e.preventDefault();
      const characterName = e.target.value;

      const charFilByName = data.filter(character => character.name === characterName);
      
      this.update(charFilByName);
    });
  }

  static filterElementsMobile(locations){
    const formMobal = document.querySelector('.modal-filter-content form');

    formMobal.addEventListener("submit", (e) => {
      e.preventDefault();

      const valoresSelect = {};

      for(let element of formMobal.elements){
        if(element.tagName === 'SELECT') {
          valoresSelect[element.name] = element.value;
        }
      }

      const locationsFill = locations.filter(location => {
        return location.type === valoresSelect.type &&
               location.dimension === valoresSelect.dimension 
      });
      this.update(locationsFill);

      document.querySelector('#app .modal-filters').style.display = 'none';
    });
  }

  static filterElementsDesk(data){
    const form = document.querySelector('#formDesk');

    form.addEventListener("change", (e) => {
      const termFill = e.target.dataset.fill;
      const elementsFill = data.filter(data => data[termFill] === e.target.value);
      
      this.update(elementsFill);
    });
  }
}