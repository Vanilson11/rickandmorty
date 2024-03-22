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

  goBack(href){
    const btn = document.querySelector('.btn-go-back span');
    btn.addEventListener("click", () => {
      Router.route(href, null);
    });
  }
}

//classe para manipular o HTML
export class CharactersView extends Characters{
  constructor(root){
    super();
    this.root = document.querySelector(root);
  }

  update(characters){
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

    this.charDetails(elementsDetails);
  }

  async charDetails(elementsDetails){
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

  changeElementsDetails(character){
    const btn = new Characters();
    btn.goBack("/");
    
    document.querySelector('.details-img img').src = `${character.image}`;
    document.querySelector('.details-img img').alt = `Imagem de ${character.name}`;
    document.querySelector('.char-name span').textContent = `${character.name}`;
    document.querySelector('.informations .infoGender').textContent = `${character.gender}`;
    document.querySelector('.informations .infoStatus').textContent = `${character.status}`;
    document.querySelector('.informations .infoSpecie').textContent = `${character.species}`;
  }

  filterByName(data){
    const inName = document.querySelector('#byName');
    inName.addEventListener("blur", (e) => {
      e.preventDefault();
      const characterName = e.target.value;

      const charFilByName = data.filter(character => character.name === characterName);
      
      this.update(charFilByName);
    });
  }

  filterElementsMobile(data){
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

      console.log(charactersFill)

      document.querySelector('#app .modal-filters').style.display = 'none';
      
      this.update(charactersFill);
    });
  }

  filterElementsDesk(data){
    const inSpecie = document.querySelector('#formDesk');

    inSpecie.addEventListener("change", (e) => {
      const termFill = e.target.dataset.fill;
      const elementsFill = data.filter(data => data[termFill] === e.target.value);
      
      this.update(elementsFill);
    });
  }
}

export class LocationsView extends Characters{
  static residentsData = [];
  static location;

  static async filterLocation(data, href){
    const { residents } = data;
    
    this.residentsData = await this.fetchAllData(residents);
    this.updateResidents(this.residentsData, href);
  }

  static async fetchData(link){
    const respo = await fetch(link);
    const data = await respo.json();
    return data;
  }

  static async fetchAllData(links){
    const promisses = links.map(link => this.fetchData(link));
    const dataArray = await Promise.all(promisses);
    console.log(dataArray)
    return dataArray
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
        
        Router.route(href, this.location);
        
        this.filterLocation(this.location, href);
      });
    });
  }

  static changeElementsDetails(data){
    const btn = new Characters();
    btn.goBack("/locations");
    
    document.querySelector('.locationEpisode-name h2').textContent = `${data.name}`;
    document.querySelector('.locationEpisode-type span').textContent = `${data.type}`;
    document.querySelector('.locationEpisode-dimension span').textContent = `${data.dimension}`;
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

  static async updateResidents(data, href){
    document.querySelector('.residentsCast-content').innerHTML = '';

    data.forEach(resident => {
      document.querySelector('.residentsCast-content').innerHTML += `
      <div class="card-personagem">
        <div class="personagem-img" href="${href}">
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
}

export class EpisodesView extends Characters{
  static charEpisodes = [];

  static async fetchData(link){
    const respo = await fetch(link);
    const data = await respo.json();
    return data;
  }

  static async fetchAllData(links){
    const promisses = links.map(link => this.fetchData(link));
    const dataArray = await Promise.all(promisses);
    this.charEpisodes = dataArray;
    console.log(this.charEpisodes)
    return dataArray;
  }

  async getCharacters(data, href){
    const { characters } = data;
    
    const charConver = await this.fetchAllEps(characters);
    console.log(charConver);
    LocationsView.updateResidents(charConver, href);
  }

  async fetchAllEps(links){
    const promisses = links.map(link => this.fetchEp(link));
    const dataArray = await Promise.all(promisses);
    
    return dataArray;
  }

  async fetchEp(link){
    const respo = await fetch(link);
    const data = await respo.json();
    return data;
  }

  static async update(data){
    document.querySelector('.locationsEpisodes-content').innerHTML = '';
    data.forEach(episode => {
      document.querySelector('.locationsEpisodes-content').innerHTML += `
      <div class="card-locationEpisode">
        <p class="locationEpisode-nome" href="/episodeDetails">${episode.name}</p>
        <span class="location-type epData">${episode.air_date}</span>
        <span class="epNumber">${episode.episode}</span>
      </div>
      `
    });

    const elementsDetails = document.querySelectorAll('.locationEpisode-nome');
    
    const teste = new EpisodesView()
    teste.episodeDetails(elementsDetails);
    Characters.creatDataOptions(data);
    teste.filterByName(data);
  }

  episodeDetails(data){
    data.forEach(element => {
      element.addEventListener("click", (event) => {
        const epName = event.target.textContent;
        const href = event.target.attributes.href.value;
        
        const episode = EpisodesView.charEpisodes.find(ep => ep.name === epName);
        
        Router.route(href, episode);
        this.getCharacters(episode, href);
      });
    });
  }

  changeElementsDetails(data){
    this.goBack("/episodes")

    document.querySelector('.locationEpisode-name h2').textContent = `${data.name}`;
    document.querySelector('.locationEpisode-type span').textContent = `${data.episode}`;
    document.querySelector('.locationEpisode-dimension span').textContent = `${data.air_date}`;
  }

  filterByName(data){
    const inName = document.querySelector('#byName');
    inName.addEventListener("blur", (e) => {
      e.preventDefault();
      const episodeName = e.target.value;

      const epFilByName = data.filter(episode => episode.name === episodeName);
      
      EpisodesView.update(epFilByName);
    });
  }
}