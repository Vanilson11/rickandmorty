export class CharactersData{
  static locations = [];
  static async getCharacters(){
    try{
      const res = await fetch("https://rickandmortyapi.com/api/character");
      const respConvertida = await res.json();
      const { results } = await respConvertida;
      return results;
    }catch(error){

    }
  }

  static async getLocations(){
    try{
      const res = await fetch("https://rickandmortyapi.com/api/character");
      const respConvertida = await res.json();
      const { results } = await respConvertida;
      
      results.forEach(element => {
        this.locations.push(element.location);
      });

      return this.locations;
    }catch(error){

    }
  }
}