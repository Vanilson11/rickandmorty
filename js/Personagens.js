//classe para buscar e tratar os dados
export class Characters{
  characters = [];
  constructor(root){
    this.root = document.querySelector(root);
    this.load();
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
    this.update(this.characters);
    this.creatDataOptions(this.characters);
    /*this.characters.forEach(character => {
      console.log(character.status)
    })*/
  }
}

//classe para manipular o HTML
export class CharactersView extends Characters{
  constructor(root){
    super(root);
    this.filterByName();
    this.filterElementsDesk();
    this.filterElementsMobile();
  }

  update(characters){
    const cardsContainer = this.root.querySelector('.cards-wrapper .cards-content');
    cardsContainer.innerHTML = '';
    characters.forEach(character => {
      cardsContainer.innerHTML += `
        <div class="card-personagem">
          <div class="personagem-img">
            <img src="${character.image}" alt="Imagem de ${character.name}">
          </div>
          <div class="personagem-info">
            <p class="nome">${character.name}</p>
            <span class="specie">${character.species}</span>
          </div>
        </div>
      `
    });
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
}