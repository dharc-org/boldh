import { divideEvents, populateCard, sortEvents } from "./modules/populator.js";
import { changeLinkState, handleMenu, closeModal } from "./modules/elements.js";


document.addEventListener("DOMContentLoaded", function () { // wait for page to load
  // NAVBAR LINKS ACTIVE STATE
  const anchors = document.querySelectorAll('a[href^="#"]');
  const navLinkLi = document.getElementsByClassName("nav-link-li")[0];
  
  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!(href.includes('cookie') || href === "#")){
      anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
        //closes menu after clicking a link if in hamburger mode
        if (visualViewport.width < 1024 && window.getComputedStyle(navLinkLi).display === "block") {
            setTimeout(handleMenu, 800);
        }
      });
    }
  });

  // HANDLE MENU ON RESIZE (MOBILE-MEDIUM SCREENS VS LARGE DEVICES)
  // Hamburger menu should be closed every time the user resizes the screen
  visualViewport.addEventListener("resize", () => {
    if(visualViewport.width >= 1024){
      var nvl = document.getElementsByClassName("nav-link-li"); // get nav menu links elements
      for (var i = 0; i < nvl.length; i++) {
        nvl[i].style.display = "block"; // display nav menu links 
      }
    } else {
      var nvl = document.getElementsByClassName("nav-link-li");
      for (var i = 0; i < nvl.length; i++) {
        nvl[i].style.display = "none"; // hide nav menu links 
        handleMenu(); // close hamburger menu by calling handleMenu()
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


  // OPEN/CLOSE MENU
  document.getElementById("h-menu-div").addEventListener("click", function(){
    handleMenu(); // Handles menu opening and closing
  });
  // CLOSE MODAL
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




// FETCH DATA FROM JSON
// Agenda data needs a division in active and concluded events, thus sorted by date
// For news data, the first in the fetched JSON is the first visible on the website

// news data
let newsArray = [];
fetch("content/news.json", {cache: "no-store"})
  .then((res) => res.json())
  .then((data) => {   
    newsArray = data;   
  })
  .then(() => {
    newsArray.forEach(function (newsItem) {
      populateCard("news", newsItem); // populate card with news item data
    })
  })
  .catch(error => {
    console.error('Error occurred while fetching news data:', error)
  });


// agenda data
var agendaArray = [];
fetch("content/agenda.json", {cache: "no-store"}) // JSON on github repo
  .then((res) => res.json())
  .then((data) => {
    agendaArray = data;
  })
  .then(() => {
    // divide events in active and concluded events and sort them by date
    let [activeEvents, concludedEvents] = divideEvents(agendaArray); 
    activeEvents = sortEvents(activeEvents).reverse(); // most recent first
    concludedEvents = sortEvents(concludedEvents); // next first

    activeEvents.forEach(function (event){
      populateCard("active", event); // populate card with active event data
    });
    concludedEvents.forEach(function (event){
      populateCard("concluded", event); // populate card with concluded event data
    });
  })
  .catch(error => {
    console.error('Error occurred while fetching agenda data:', error)
  });
