// _________________________________________________________________________________________________________________________
// CALLBACK FUNCTIONS
// Callback functions called within the DOMContentLoaded event listener

// _________________________
// NAVBAR LINKS STATE CHANGE
export function changeLinkState() {
    const links = document.querySelectorAll('.nav-link-li a');
    const sections = document.querySelectorAll('section');
    let index = sections.length;
    while(--index && window.scrollY + 50 < sections[index].offsetTop) {}
    links.forEach((link) => link.classList.remove('active'));
    links[index].classList.add('active');
  }
  
  
// ____________________________________________________________
// CLOSE MODAL FUNCTION TRIGGERD BY CLOSE ICON IN MODAL CONTENT
export function closeModal(){
    document.getElementById("modal-overlay").style.display = "none";
    document.getElementById("expansion-container").style.display = "none";
    document.getElementById("modal-content").innerHTML = "";
    document.body.style.overflow = "auto";
}
  
// ________________________________________________________
// OPEN/CLOSE MENU FUNCTION TRIGGERD BY HAMBURGER MENU ICON
// Dpending on the display property of the nav menu links, the function opens or closes the menu
export function handleMenu(){
    let elements = document.getElementsByClassName("nav-link-li");
    if(window.getComputedStyle(elements[0]).display === "none"){ // if nav menu links are not displayed
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block"; // display nav menu links
      };
      // These following lines of code handle the animation of the hamburger menu icon leading from hamburger to cross
      document.getElementById("hamburger").id = "hamburger-x"
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "none"; // hide nav menu links 
      }
      // These following lines of code handle the animation of the hamburger menu icon leading from cross to hamburger
      document.getElementById("hamburger-x").id = "hamburger"
    }
}