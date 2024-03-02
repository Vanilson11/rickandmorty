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
    this.update();
  }
}

//classe para manipular o HTML
export class CharactersView extends Characters{
  constructor(root){
    super(root);
  }

  update(){
    this.characters.forEach(character => {
      const cardsContainer = this.root.querySelector('.cards-wrapper .cards-content');

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
}