// NAVBAR LINKS STATE CHANGE
export function changeLinkState() {
  const links = document.querySelectorAll('.nav-link-li a')
  const sections = document.querySelectorAll('section')
  let index = sections.length
  // iterate to decrement and reassign the index variable dependnding on the position in the page
  while (--index && window.scrollY + 50 < sections[index].offsetTop) {}
  links.forEach((link) => link.classList.remove('active'))
  links[index].classList.add('active')
}

// CLOSE MODAL FUNCTION TRIGGERD BY CLOSE ICON IN MODAL CONTENT
export function closeModal() {
  document.getElementById('modal-overlay').classList.remove('modal-overlay-show');
  document.getElementById('expansion-container').classList.remove('expansion-container-show');
  document.getElementById('modal-content').innerHTML = ''
  document.body.style.overflow = 'auto'
}

// OPEN/CLOSE MENU FUNCTION
export function handleMenu() {
  let navLinks = document.getElementsByClassName('nav-link-li')
  if (window.getComputedStyle(navLinks[0]).display === 'none') {
    // if nav menu links are not displayed
    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].style.display = 'block' // display nav menu links
    }
    document.getElementById('hamburger').id = 'hamburger-x'
  } else {
    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].style.display = 'none' // hide nav menu links
    }
    document.getElementById('hamburger-x').id = 'hamburger'
  }
}
