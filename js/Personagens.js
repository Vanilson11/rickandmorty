import { CharactersData } from "./CharactersData.js";
import { Router } from "./Router.js";

export class Characters extends Router{
  characters = [];
  locations = [];
  constructor(){
    super();
    this.load();
  }

  async load(){
    this.characters = await CharactersData.getCharacters();
    
    this.locations = await CharactersData.getLocations();
  }

  async updateResidents(data, href){
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
  }

  async fetchAllData(links){
    const promisses = links.map(link => this.fetchData(link));
    const dataArray = await Promise.all(promisses);
    
    return dataArray;
  }

  async fetchData(link){
    const respo = await fetch(link);
    const data = await respo.json();
    return data;
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
  constructor(){
    super();
  }

  update(characters){
    console.log(characters);
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

  async changeElementsDetails(character){
    const { origin, location, episode } = character;
    const btn = new Characters();
    btn.goBack("/");
    
    document.querySelector('.details-img img').src = `${character.image}`;
    document.querySelector('.details-img img').alt = `Imagem de ${character.name}`;
    document.querySelector('.char-name span').textContent = `${character.name}`;
    document.querySelector('.informations .infoGender').textContent = `${character.gender}`;
    document.querySelector('.informations .infoStatus').textContent = `${character.status}`;
    document.querySelector('.informations .infoSpecie').textContent = `${character.species}`;
    document.querySelector('.informations .infoOrigin').textContent = `${origin.name}`;
    document.querySelector('.informations .infoType').textContent = `${character.type}`;
    document.querySelector('.informations .infoLocation').textContent = `${location.name}`;

    const loc = document.querySelector('#inforLocati');
    loc.addEventListener("click", async (event) => {
      if(event.target.tagName != "H4") {
        
      } else {
        const { textContent } = event.target.nextElementSibling;
        const loc = this.locations.find(element => element.name === textContent);
        const { residents } = loc;
        console.log(loc);

        Router.route("/locationsDetails", loc);
        const chars = await this.fetchAllData(residents);
        this.updateResidents(chars);
      }
    });

    const eps = await this.fetchAllData(episode);
    eps.forEach(ep => {
      document.querySelector('.episodes-wrapper').innerHTML += `
        <div class="episodes">
          <h4>${ep.episode}</h4>
          <span class="ep-name">${ep.name}</span>
          <span class="ep-data">${ep.air_date}</span>
        </div>
      `;
    });
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
  residentsData = [];
  location;

  async filterLocation(data, href){
    const { residents } = data;
    
    this.residentsData = await this.fetchAllData(residents);
    console.log(this.residentsData)
    this.updateResidents(this.residentsData, href);
  }

  update(data){
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
    this.locationDetails(elementsDetails, data);
  }

  async locationDetails(elementsDetails, data){
    elementsDetails.forEach(element => {
      element.addEventListener("click", async (e) => {
        const locationName = e.target.textContent;
        const href = e.target.attributes.href.value;

        this.location = data.find(location => location.name === locationName);
        
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

  creatDataOptions(data){
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

  filterByName(data){
    const inName = document.querySelector('#byName');
    inName.addEventListener("blur", (e) => {
      e.preventDefault();
      const characterName = e.target.value;

      const charFilByName = data.filter(character => character.name === characterName);
      
      this.update(charFilByName);
    });
  }

  filterElementsMobile(locations){
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

  filterElementsDesk(data){
    const form = document.querySelector('#formDesk');

    form.addEventListener("change", (e) => {
      const termFill = e.target.dataset.fill;
      const elementsFill = data.filter(data => data[termFill] === e.target.value);
      
      this.update(elementsFill);
    });
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
    console.log(this.charEpisodes);
    return dataArray;
  }

  async getCharacters(data, href){
    const { characters } = data;
    
    const charConver = await this.fetchAllData(characters);
  
    this.updateResidents(charConver, href);
  }

  async update(data){
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
    
    Characters.creatDataOptions(data);
    this.episodeDetails(elementsDetails);
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
      console.log(epFilByName)
      this.update(epFilByName);
    });
  }
}