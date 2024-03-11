import { Characters, LocationsView } from "./Personagens.js";
import { CharactersView } from "./Personagens.js";
import { CharactersData } from "./CharactersData.js";
import * as advFill from "./toggleModal.js"

export class Router{
  data = [];
  locations = [];
  static routes = {};

  static async getCharacters(){
    this.data = await CharactersData.getCharacters();
    return this.data;
    //CharactersView.update(this.data);
    //CharactersView.filterByName(this.data);
  }

  static async getLocations(){
    this.locations = await CharactersData.getLocations();
    return this.locations;
  }

  static addRoute(href, link){
    this.routes[href] = link;
  }

  static async route(href, character){
    window.history.pushState({}, "", href);

    this.handlePage(character);
  }

  static async handlePage(character){
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

        advFill.openAdvancedFilter();
        advFill.closeAdvancedFilters();

        CharactersView.update(data);
        Characters.creatDataOptions(data);
        CharactersView.filterByName(data);
        CharactersView.filterElementsMobile(data);
        CharactersView.filterElementsDesk(data);
      });
    } else if(pathname === "/locations"){
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;
        
        const locations = await this.getLocations();

        advFill.openAdvancedFilter();
        advFill.closeAdvancedFilters();

        LocationsView.update(locations);
        LocationsView.filterByName(locations);
        LocationsView.creatDataOptions(locations);
        LocationsView.filterElementsMobile(locations);
        LocationsView.filterElementsDesk(locations);
      });
    } else {
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

        CharactersView.changeElementsDetails(character);
      });
    }
  }
}