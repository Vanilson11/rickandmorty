import { Characters, EpisodesView, LocationsView } from "./Personagens.js";
import { CharactersView } from "./Personagens.js";
import { CharactersData } from "./CharactersData.js";
import * as advFill from "./toggleModal.js"

export class Router{
  data = [];
  locations = [];
  episodes = [];
  static routes = {};

  static async getCharacters(){
    this.data = await CharactersData.getCharacters();
    return this.data;
  }

  static async getLocations(){
    this.locations = await CharactersData.getLocations();
    return this.locations;
  }

  static async getEps(){
    this.episodes = await CharactersData.getEpisodes();
    
    return this.episodes
  }

  static addRoute(href, link){
    this.routes[href] = link;
  }

  static async route(href, datas){
    window.history.pushState({}, "", href);

    this.handlePage(datas);
  }

  static async handlePage(datas){
    const { pathname } = window.location;
    const route = this.routes[pathname];
    console.log(pathname)
    console.log(route)

    if(pathname === "/"){
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

        const data = await this.getCharacters();

        advFill.openAdvancedFilter();
        advFill.closeAdvancedFilters();

        const calls = new CharactersView("#app");

        calls.update(data);
        calls.filterByName(data);
        calls.filterElementsMobile(data);
        calls.filterElementsDesk(data);
        Characters.creatDataOptions(data);
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
    } else if(pathname === "/locationsDetails") {
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

        LocationsView.changeElementsDetails(LocationsView.location);
      });
    } else if(pathname === "/charDetails") {
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

        const calls = new CharactersView("#app");
        
        calls.changeElementsDetails(datas)
      });
    } else if(pathname === "/episodes"){
      fetch(route).then(data => data.text()).then(async html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

        const links = await this.getEps();
    
        const episodes = await EpisodesView.fetchAllData(links);
        EpisodesView.update(episodes);
      });
    } else if(pathname === "/episodeDetails"){
      fetch(route).then(data => data.text()).then(html => {
        document.querySelector('#app').innerHTML = '';
        document.querySelector('#app').innerHTML = html;

        const update = new EpisodesView();
        update.changeElementsDetails(datas);
      })
    }
  }
}