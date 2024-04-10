import {
  divideEvents,
  populateCard,
  sortEvents,
  populateModal,
} from './modules/cardPopulator.js'
import { changeLinkState, handleMenu, closeModal } from './modules/DOMManipulationUtils.js'

document.addEventListener('DOMContentLoaded', function () {
  // NAVBAR LINKS ACTIVE STATE
  const anchors = document.querySelectorAll('a[href^="#"]')
  const navLinkLi = document.getElementsByClassName('nav-link-li')[0]

  anchors.forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (!(href.includes('cookie') || href === '#')) {
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector(href).scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        })
        //closes menu after clicking a link if in hamburger mode
        if (
          visualViewport.width < 1024 &&
          window.getComputedStyle(navLinkLi).display === 'block'
        ) {
          setTimeout(handleMenu, 800)
        }
      })
    }
  })

  // HANDLE MENU ON RESIZE (MOBILE-MEDIUM SCREENS VS LARGE DEVICES)
  // Hamburger menu should be closed every time the user resizes the screen
  visualViewport.addEventListener('resize', () => {
    let navLinks = document.getElementsByClassName('nav-link-li')
    if (visualViewport.width >= 1024) {
      for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].style.display = 'block' // display nav menu links
      }
    } else {
      for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].style.display = 'none' // hide nav menu links
        handleMenu() // close hamburger menu by calling handleMenu()
      }
    }
  })

  // ON SCROLL ANIMATIONS AND ACTIONS
  window.onscroll = function () {
    // change active state of navbar links
    changeLinkState()
    // rotating logo animation
    let theta = (document.documentElement.scrollTop / 1000) % Math.PI // theta is the angle of rotation of the logo (it is a function of the scroll position)
    document.getElementById('logo-rotate').style.transform =
      'rotate(' + theta + 'rad)' // rotate logo by theta radians
  }

  // OPEN/CLOSE MENU
  document.getElementById('h-menu-div').addEventListener('click', function () {
    handleMenu() // Handles menu opening and closing
  })
  // CLOSE MODAL
  document
    .getElementById('modal-close-icon')
    .addEventListener('click', function () {
      closeModal()
    })

  // OPEN/CLOSE TOPIC DESCRIPTION
  document.querySelectorAll('.research-topic').forEach((topic) => {
    topic.addEventListener('click', function () {
      let box = this.querySelector('p')
      let arr = this.querySelector('.topic-arrow-cnt')
      // Toggle the display property of the 'p' element
      box.classList.toggle('show-topic-text') 
      arr.classList.toggle('arrow-rotate')
    })
  })
})

// FETCH DATA FROM JSON
// Agenda data needs a division in active and concluded events, thus sorted by date
// For news data, the first in the fetched JSON is the first visible on the website

// news data
let newsArray = []
fetch('content/news.json', { cache: 'no-store' })
  .then((res) => res.json())
  .then((data) => {
    newsArray = data
  })
  .then(() => {
    newsArray.forEach(function (newsItem) {
      let [box, element] = populateCard('news', newsItem) // populate card with news item data
      box.innerHTML += element
    })
  })
  .catch((error) => {
    console.error('Error occurred while fetching news data:', error)
  })

// agenda data
let agendaArray = []
fetch('content/agenda.json', { cache: 'no-store' }) // JSON on github repo
  .then((res) => res.json())
  .then((data) => {
    agendaArray = data
  })
  .then(() => {
    // divide events in active and concluded events and sort them by date
    let [activeEvents, concludedEvents] = divideEvents(agendaArray)
    activeEvents = sortEvents(activeEvents).reverse() // most recent first
    concludedEvents = sortEvents(concludedEvents) // next first

    activeEvents.forEach(function (event) {
      let [container, cardContent] = populateCard('active', event) // populate card with active event data
      let newCard = document.createElement('div')
      newCard.classList.add('cb', 'card-box', 'event-box')
      newCard.innerHTML = cardContent
      container.appendChild(newCard)
      newCard
        .addEventListener('click', function () {
          populateModal(event.id, 'active', agendaArray)
        })
    })

    concludedEvents.forEach(function (event) {
      let [container, cardContent] = populateCard('concluded', event) // populate card with active event data
      let newCard = document.createElement('div')
      newCard.classList.add('cb', 'card-box-concluded', 'event-box')
      newCard.innerHTML = cardContent
      container.appendChild(newCard)
      newCard
        .addEventListener('click', function () {
          populateModal(event.id, 'concluded', agendaArray)
        })
    })
  })
  .catch((error) => {
    console.error('Error occurred while fetching agenda data:', error)
  })
