import "./toggleMenu.js";
import { CharactersView, Characters } from "./Personagens.js";
import { Router } from "./Router.js";

//const route = new Router();
Router.addRoute("/", "/pages/home.html");
Router.addRoute("/locations", "/pages/locations.html");
Router.addRoute("/charDetails", "/pages/charDetails.html");
Router.addRoute("/locationsDetails", "/pages/locationsDetails.html");
Router.addRoute("/episodes", "/pages/episodes.html");
Router.addRoute("/episodeDetails", "/pages/episodeDetails.html")

const teste = new Characters();
teste.clickNav();
new CharactersView("#app");

//route.getData();
Router.handlePage();

window.onpopstate = () => Router.handlePage();
