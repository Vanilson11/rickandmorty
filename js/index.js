import "./toggleMenu.js";

async function search(){
  const resp = await fetch("https://rickandmortyapi.com/api/character");
  const respConvertida = await resp.json();
  //console.log(respConvertida);
}

search();