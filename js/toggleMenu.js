export const btnToggle = document.querySelectorAll('.icon-menu [data-menuView]');

btnToggle.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const toggle = document.documentElement.classList.toggle('mobal');
    if(toggle){
      const nav = document.querySelector('.header-mobile');
      nav.style.display = 'flex';
    } else {
      const nav = document.querySelector('.header-mobile');
      nav.style.display = 'none';
    }
  });
})