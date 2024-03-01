export const btnAdvancedFilters = document.querySelector('.advancedFilters button');
export const closeAdvancedFilters = document.querySelector('.head-fiter-content p');

btnAdvancedFilters.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector('#app .modal-filters').style.display = 'flex';
});

closeAdvancedFilters.addEventListener("click", () => {
  document.querySelector('#app .modal-filters').style.display = 'none';
});