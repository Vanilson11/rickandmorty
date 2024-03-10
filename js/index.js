import "./toggleMenu.js";
import { CharactersView } from "./Personagens.js";
import { Router } from "./Router.js";

const route = new Router();
route.addRoute("/", "/pages/home.html");
route.addRoute("/locations", "/pages/locations.html");
route.addRoute("/charDetails", "/pages/charDetails.html");

new CharactersView("#app");

//route.getData();
route.handlePage();

window.onpopstate = () => route.handlePage();
