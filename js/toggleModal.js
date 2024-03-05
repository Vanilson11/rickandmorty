export function openAdvancedFilter(){
  const btnAdvancedFilters = document.querySelector('.advancedFilters button');
  btnAdvancedFilters.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector('#app .modal-filters').style.display = 'flex';
  });
}


export function closeAdvancedFilters(){
  const closeFilters = document.querySelector('.head-fiter-content p');

  closeFilters.addEventListener("click", () => {
    document.querySelector('#app .modal-filters').style.display = 'none';
  });
}