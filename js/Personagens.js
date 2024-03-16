import { CharactersData } from "./CharactersData.js";
import { Router } from "./Router.js";

export class Characters extends Router{
  characters = [];
  locations = [];
  routes = {};
  root;
  constructor(){
    super();
    this.load();
  }

  async load(){
    this.characters = await CharactersData.getCharacters();
    
    this.locations = await CharactersData.getLocations();
  }

  static creatDataOptions(data){
    const dataList = document.querySelector('.filters datalist');
    
    data.forEach(data => {
      const option = document.createElement('option');
      option.value = `${data.name}`;

      dataList.appendChild(option);
    });
  }

  /*realoadOnCharDetails(){
    window.addEventListener("beforeunload", (event) => {
      const teste = function () {
        window.location.href = "/";
      }
      window.location.replace(teste);
    })
  }*/

  clickNav(){

  }
}

//classe para manipular o HTML
export class CharactersView extends Characters{
  constructor(root){
    super();
    this.root = document.querySelector(root);
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

  goBackHome(){
    const btn = this.root.querySelector('.btn-go-back span');
    btn.addEventListener("click", (event) => {
      Router.route("/", null);
    });
  }
}

export class LocationsView extends Characters{
  static residentsData = [];
  static location;

  static locationsData = this.getLocations();

  static async getLocations(){
    this.locationsData = await Router.getLocations();
    return this.locationsData;
  }

  static filterLocation(data){
    const { residents } = data;
    
    this.getResidents(residents);

    //return location;
  }

  static getResidents(residents){
    try{
      const resData = [];
      residents.forEach(async resident => {
        try{
          const respo = await fetch(resident);
          const respConvertida = await respo.json();

          resData.push(respConvertida);
        }catch(error){}
      });
      this.residentsData = resData;
    }catch(error){

    }
  }

  static update(data){
    document.querySelector('.locationsEpisodes-content').innerHTML = '';
    data.forEach(location => {
      document.querySelector('.locationsEpisodes-content').innerHTML += `
      <div class="card-locationEpisode">
        <p class="locationEpisode-nome" href="/locationsDetails">${location.name}</p>
        <span class="location-type epData">${location.type}</span>
        <span class="epNumber"></span>
      </div>
      `
    });

    const elementsDetails = document.querySelectorAll('.locationEpisode-nome');
    LocationsView.locationDetails(elementsDetails);
  }

  static async locationDetails(elementsDetails){
    elementsDetails.forEach(element => {
      element.addEventListener("click", async (e) => {
        const locationName = e.target.textContent;
        const href = e.target.attributes.href.value;
        const locations = await CharactersData.getLocations();

        this.location = locations.find(location => location.name === locationName);
        this.filterLocation(this.location);
        
        Router.route(href, this.location);
      });
    });
  }

  static changeElementsDetails(location){
    this.goBackHome();
    
    document.querySelector('.location-name h2').textContent = `${location.name}`;
    document.querySelector('.location-type h3').textContent = `${location.type}`;
    document.querySelector('.location-dimension h3').textContent = `${location.dimension}`;
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

  static async updateResidents(data){
    document.querySelector('.residents-content').innerHTML = '';

    data.forEach(resident => {
      document.querySelector('.residents-content').innerHTML += `
      <div class="card-personagem">
        <div class="personagem-img" href="/charDetails">
          <img src="${resident.image}" alt="Imagem de ${resident.name}">
        </div>
        <div class="personagem-info">
          <p class="nome">${resident.name}</p>
          <span class="specie">${resident.species}</span>
        </div>
      </div>
      `
    });

    const elementsDetails = document.querySelectorAll('.card-personagem .personagem-img');
    //CharactersView.charDetails(elementsDetails);
  }

  static goBackHome(){
    const btn = document.querySelector('.btn-go-back span');
    btn.addEventListener("click", (event) => {
      Router.route("/locations", null);
    });
  }
}

export class EpisodesView extends Characters{
  static showEpisodes(){
    CharactersData.getEpisodes();
  }
}