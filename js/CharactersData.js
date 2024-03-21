export class CharactersData{
  static locations = [];
  static episodesData = [];

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
      const res = await fetch("https://rickandmortyapi.com/api/location");
      const respConvertida = await res.json();
      const { results } = await respConvertida;

      return results;
    }catch(error){

    }
  }

  static async getEpisodes(){
    try{
      const res = await fetch("https://rickandmortyapi.com/api/character");
      const respConvertida = await res.json();
      const { results } = await respConvertida;

      results.forEach(result => {
        const { episode } = result;
        
        for(let i = 0; i < episode.length; i++){
          if(this.episodesData[i] === `https://rickandmortyapi.com/api/episode/${i + 1}`){
            continue;
          } else{
            this.episodesData.push(episode[i]);
          }
        }
      });
    }catch(error){}

    return this.episodesData;
  }
}