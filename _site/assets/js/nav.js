(function() {
  const navTrigger = document.querySelector('#nav-trigger');
  const nav = document.querySelector('nav');

  if (navTrigger) {
    navTrigger.addEventListener('click', function(e) {
      nav.classList.toggle("open", e.target.checked);
    });
  }
  
})();