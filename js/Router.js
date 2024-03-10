import { Characters, LocationsView } from "./Personagens.js";
import { CharactersView } from "./Personagens.js";
import { CharactersData } from "./CharactersData.js";

export class Router{
  data = [];
  locations = [];
  routes = {};

  async getCharacters(){
    this.data = await CharactersData.getCharacters();
    return this.data;
    //CharactersView.update(this.data);
    //CharactersView.filterByName(this.data);
  }

  async getLocations(){
    this.locations = await CharactersData.getLocations();
    return this.locations;
  }

  addRoute(href, link){
    this.routes[href] = link;
  }

  async route(href, character){
    window.history.pushState({}, "", href);

    this.handlePage(character);
  }

  async handlePage(character){
    const { pathname } = window.location;
    const route = this.routes[pathname];
    console.log(pathname);
    console.log(route);

    if(pathname === "/"){
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
        //this.getData();

        const data = await this.getCharacters();
        CharactersView.update(data);
        CharactersView.filterByName(data);
        Characters.creatDataOptions(data);
      });
    } else if(pathname === "/locations"){
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
        
        const locations = await this.getLocations();
        LocationsView.update(locations);
        CharactersView.filterByName(locations);
        Characters.creatDataOptions(locations);
      });
    } else {
      fetch(route).then(data => data.text()).then(html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
      });
    }
  }
}