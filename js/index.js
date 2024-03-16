import "./toggleMenu.js";
import { CharactersView } from "./Personagens.js";
import { Router } from "./Router.js";

//const route = new Router();
Router.addRoute("/", "/pages/home.html");
Router.addRoute("/locations", "/pages/locations.html");
Router.addRoute("/charDetails", "/pages/charDetails.html");
Router.addRoute("/locationsDetails", "/pages/locationsDetails.html");
Router.addRoute("/episodes", "/pages/episodes.html");

new CharactersView("#app");

//route.getData();
Router.handlePage();

window.onpopstate = () => Router.handlePage();
