document.addEventListener("DOMContentLoaded", function () { // wait for page to load

  // NAVBAR LINKS ACTIVE STATE
  const anchors = document.querySelectorAll('a[href^="#"]');
  const navLinkLi = document.getElementsByClassName("nav-link-li")[0];
  
  anchors.forEach(anchor => {

    if (!(anchor.getAttribute('href').includes('cookie') || anchor.getAttribute('href') === "#")){
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        document.querySelector(href).scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
        if (visualViewport.width < 1024 && window.getComputedStyle(navLinkLi).display === "block") {
            setTimeout(openMenu, 800);
        }
      });
    }
  });


  // HANDLE MENU ON RESIZE (MOBILE-MEDIUM SCREENS VS LARGE DEVICES)
  // The menu in mobile version is a hamburger menu that opens and closes the nav menu on click and should be closed every time the user resizes the screen
  visualViewport.addEventListener("resize", () => { // add event listener for resize
    if(visualViewport.width >= 1024){ // if screen width is larger than 1024px (large devices)
      var nvl = document.getElementsByClassName("nav-link-li"); // get nav menu links elements
      for (var i = 0; i < nvl.length; i++) {
        nvl[i].style.display = "block"; // display nav menu links 
      }
    } else {
      var nvl = document.getElementsByClassName("nav-link-li");
      for (var i = 0; i < nvl.length; i++) {
        nvl[i].style.display = "none"; // hide nav menu links 
        openMenu(); // close hamburger menu by calling openMenu function (look at openMenu function below)
      }
    }
  });


  // ON SCROLL ANIMATIONS AND ACTIONS
  window.onscroll = function () {
    // change active state of navbar links
    changeLinkState(); 
    // rotating logo animation
    var theta = (document.documentElement.scrollTop / 1000) % Math.PI; // theta is the angle of rotation of the logo (it is a function of the scroll position)
    document.getElementById("logo-rotate").style.transform = "rotate(" + theta + "rad)"; // rotate logo by theta radians

  };


  // OPEN/CLOSE MENU AND CLOSE MODAL
  document.getElementById("h-menu-div").addEventListener("click", function(){
    openMenu(); // Handles menu opening and closing
  });

  document.getElementById("modal-close-icon").addEventListener("click", function(){
    closeModal();
  });

  
  // OPEN/CLOSE TOPIC DESCRIPTION
  document.querySelectorAll(".research-topic").forEach(topic => {
    topic.addEventListener("click", function(){
      let box = this.querySelector('p');
      let arr = this.querySelector('.topic-arrow-cnt')
      // Toggle the display property of the 'p' element
      if (box.style.display === 'none' || box.style.display == '') {
        box.style.display = 'block';
        arr.classList.add('arrow-rotate')
      } else {
        box.style.display = 'none';
        arr.classList.remove('arrow-rotate')
      }
    })
  })

});







// _________________________________________________________________________________________________________________________
// CALLBACK FUNCTIONS
// Callback functions called within the DOMContentLoaded event listener

// _________________________
// NAVBAR LINKS STATE CHANGE

function changeLinkState() {
  const links = document.querySelectorAll('.nav-link-li a');
  const sections = document.querySelectorAll('section');
  let index = sections.length;
  while(--index && window.scrollY + 50 < sections[index].offsetTop) {}
  links.forEach((link) => link.classList.remove('active'));
  links[index].classList.add('active');
}


// _______________________________
// CHECK IF ELEMENT IS IN VIEWPORT
function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect(); // get bounding box of element (position and size)
  return ( // return true if element is in viewport (if all conditions are true)
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}


// ____________________________________________________________
// CLOSE MODAL FUNCTION TRIGGERD BY CLOSE ICON IN MODAL CONTENT
function closeModal(){
  document.getElementById("modal-overlay").style.display = "none";
  document.getElementById("expansion-container").style.display = "none";
  document.getElementById("modal-content").innerHTML = "";
  document.body.style.overflow = "auto";
}

// ________________________________________________________
// OPEN/CLOSE MENU FUNCTION TRIGGERD BY HAMBURGER MENU ICON
// Dpending on the display property of the nav menu links, the function opens or closes the menu
function openMenu(){
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


