document.addEventListener("DOMContentLoaded", function () { // wait for page to load

  // NAVBAR LINKS ACTIVE STATE
  document.querySelectorAll('a[href^="#"]').forEach(anchor => { // for each link that starts with #
    anchor.addEventListener('click', function (e) { // add event listener for click
        e.preventDefault(); // prevent default action
        document.querySelector(this.getAttribute('href')).scrollIntoView({  // scroll to section with id equal to href
            block: 'start', // start of the section
            behavior: 'smooth' // smooth scroll
        });
        if(visualViewport.width < 1024 && window.getComputedStyle(document.getElementsByClassName("nav-link-li")[0]).display == "block"){ // if nav menu is open
          setTimeout(() => { openMenu();; }, 800); // close mobile nav menu after 800ms (time of scroll animation)
          };
    });
  });


  // MANAGE MENU ON RESIZE (MOBILE-MEDIUM SCREENS VS LARGE DEVICES)
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
// FETCH DATA FROM JSON
// News data are simpler than agenda data, so I fetch them first and populate the cards with them before fetching and populating the cards with agenda data.
// Agenda data fetching and populating is more complex because I have to divide the events in active and concluded events and sort them by date via callback functions.
// News data are in turn organized in a single array of objects, so the first in the JSON is the first visible in the website.

// news data
var news_array = [];
fetch("https://raw.githubusercontent.com/tommasobattisti/boldh/main/content/news.json", {cache: "no-store"}) // JSON on github repo
  .then((res) => res.json()) // get json data from response
  .then((data) => {   
    news_array = data;    // save json data in news_array
  })
  .then(() => {
    news_array.forEach(function (news_item) {  // for each news item in news_array
      populateCard("news", news_item); // populate card with news item data (look at populateCard function below)
    });
  });

// agenda data
var agenda_array = [];
fetch("https://raw.githubusercontent.com/tommasobattisti/boldh/main/content/agenda.json", {cache: "no-store"}) // JSON on github repo
  .then((res) => res.json())
  .then((data) => {
    agenda_array = data;
  })
  .then(() => {
      divideEvents(agenda_array); // divide events in active and concluded events and sort them by date (look at divideEvents function below)
  });



// _________________________________________________________________________________________________________________________
// DIVIDE EVENTS IN ACTIVE AND CONCLUDED EVENTS AND SORT THEM BY DATE
function divideEvents(agendaArray){
  let activeArr = [];
  let concludedArr = [];
  // for each event in agendaArray check if it is concluded or active and push it in the corresponding array
  agendaArray.forEach(function (item) { 
    let itemIndex = agendaArray.indexOf(item); 
    item.id = itemIndex;
    if (item.date.includes("-")){ // if event is a range of dates, take the last date of the range as the end date
      let dateRange = item.date.split("-");
      let endDate = dateRange[1].trim();
      var parts = endDate.split("/");
    } else {
      let endDate = item.date.trim();
      var parts = endDate.split("/");
    }
    endDate =  new Date(parts[2], parts[1] - 1, parts[0]); // create a date object from the end date of the event
    let today = new Date(); 
    endDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    // if end date is before today, event is concluded, else it is active
    if (endDate < today) {
      concludedArr.push(item);
    } else {
      activeArr.push(item);
    };
  });
  // sort active and concluded events by date (look at sortEvents function below) and reverse them so that the most recent event is the first in the array
  activeArr = sortEvents(activeArr).reverse();
  concludedArr = sortEvents(concludedArr); // cocluded events do not need to be reversed since I want the most recent concluded event to be the first in the array
  // populate cards with events data (look at populateCard function below)
  activeArr.forEach(function (item){
    populateCard("active", item); // populate card with active event data
  });
  concludedArr.forEach(function (item){
    populateCard("concluded", item); // populate card with concluded event data
  });
};


// _________________________________________________________________________________________________________________________
// SORT EVENTS BY DATE
function sortEvents(arr){
  arr.sort(function(a, b){ // sort events by date with a and b being two events in the array (look at MDN Array.prototype.sort() for more info)
    if (!a.date.includes("-") && !b.date.includes("-")){ // if both events are single dates (not ranges of dates)
      var partsA = a.date.split("/"); // split date string in day, month and year
      var partsB = b.date.split("/"); // split date string in day, month and year
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]); // create a date object from the date string (month - 1 because months start from 0)
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]); // create a date object from the date string (month - 1 because months start from 0)
      return dateB - dateA; // return the difference between the two dates (if positive, a is more recent than b)
    } else if (a.date.includes("-") && b.date.includes("-")){ // if both events are ranges of dates (not single dates)
      var dateRangeA = a.date.split("-"); // split date range string in start date and end date
      var dateRangeB = b.date.split("-");
      var endDateA = dateRangeA[1].trim(); // take the end date of the range as the end date of the event (trim to remove white spaces)
      var endDateB = dateRangeB[1].trim();
      var partsA = endDateA.split("/"); // split date string in day, month and year
      var partsB = endDateB.split("/");
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]); // create a date object from the date string (month - 1 because months start from 0)
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
      return dateB - dateA; // return the difference between the two dates (if positive, a is more recent than b)
    } else if (a.date.includes("-") && !b.date.includes("-")){ // if a is a range of dates and b is a single date
      var dateRangeA = a.date.split("-"); // ... it follows the same logic as above
      var endDateA = dateRangeA[1].trim(); // ... it follows the same logic as above
      var partsA = endDateA.split("/");
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]); // ... it follows the same logic as above
      var partsB = b.date.split("/");
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
      return dateB - dateA;
    } else if (!a.date.includes("-") && b.date.includes("-")){ // if a is a single date and b is a range of dates
      var dateRangeB = b.date.split("-"); // ... it follows the same logic as above
      var endDateB = dateRangeB[1].trim(); // ... it follows the same logic as above
      var partsB = endDateB.split("/");
      var dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]); // ... it follows the same logic as above
      var partsA = a.date.split("/");
      var dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
      return dateB - dateA;
    }
  });
  return arr; // return sorted array
};


// _________________________________________________________________________________________________________________________
// POPULATE CARDS WITH DATA FROM JSON AND ADD THEM TO THE WEBSITE
const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="50" viewBox="0 0 66 50" fill="none"><path d="M0 25H64M64 25L41.7391 1M64 25L41.7391 49" stroke="#F2F2F2" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
const arrowDown = '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="50" viewBox="0 0 66 50" fill="none"><path d="M0 25H64M64 25L41.7391 1M64 25L41.7391 49" stroke="#F2F2F2" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';

function populateCard(tp, item) { // tp is the type of card (news, active or concluded event), item is the object containing the data
  // Create html elements for shared content among the different types of cards
  let itemDivision = "<p class='card-division'>" + item.division + "</p>";
  let itemType = "<p class='card-type'>" + item.type + "</p>";
  // Manage title lenght avoiding too long content and breaking after a specific number of characters
  let itemTitle = "";
  if (item.title.length > 120) {
    let newTitle = item.title.substring(0, 120) + "...";
    itemTitle = "<h4 class='card-title'>" + newTitle + "</h4>";;
  } else {
    itemTitle = "<h4 class='card-title'>" + item.title + "</h4>";
  }
  // Manage card text lenght avoiding too long content and breaking after a specific number of characters
  let itemText = ""; // !!! It could be changed with subtitle for events
  if (item.text.length > 200) {
    let newText = item.text.substring(0, 200) + "...";
    itemText = "<p class='card-text'>" + newText + "</p>";
  } else {
    itemText = "<p class='card-text'>" + item.text + "</p>";
  }
  // Create html element containing title and text of the card
  let itemTextDiv = "<div class='card-text-div'>"+ itemTitle + itemText +"</div>";
  // Create variable for the entire card box and the info div containing news or events tags
  let box = "";
  let infoDiv = "";
  // depending on the type of card, create the card box and the info div containing news or events tags
  if (tp == "news") {
    box = document.getElementById("news-box-container");
    infoDiv = "<div class='card-info-div'>" + itemDivision + itemType +"</div>"; // I put division tag and type of news in the tag info div for news
  } else {
    if(tp == "concluded") {
    box = document.getElementById("agenda-box-container");
    itemDate = "<p class='agenda-"+tp+"'>" + item.date + "</p>"; // I define the date tag for concluded events 
    } else {
      box = document.getElementById("agenda-box-container");
      itemDate = "<p class='agenda-"+tp+"'>" + item.date + "</p>";  // I define the date tag for active events
    }
    let itemPlace = "<p class='card-place'>" + item.place + "</p>"; // I define the place tag for both kinds of events
    infoDiv = "<div class='card-info-div'>" + itemDivision + itemType +  itemPlace + itemDate + "</div>"; // I put division tag, type of event, place and date in the tag info div for events
  };
  // Create html elements containing main content and link arrow
  let itemContentA = "<div class='card-box-content-a'>"+ infoDiv + itemTextDiv +"</div>";
  let arrowDiv = "<div class='card-arrow-cnt'>"+ arrow +"</div></div>";
  // Depending on the type of card, create the card box with the corresponding class and populate it with the content
  // Insert url link directly in the card of news and treat it as an anchor card
  // Insert onclick function in the card of events to populate the modal with the corresponding event data and content
  // Concluded and active events have different classes that determine the color of the date tag and the card aspect and animation on over and out 
  if (tp == "news") {
    let itemUrl = item.url;
    box.innerHTML += "<a class='cb card-box' href='"+ itemUrl +"' target='_blank'>"+ itemContentA + arrowDiv +"</a>";
  } else if (tp == "concluded"){
      box.innerHTML += "<div class='cb card-box-concluded' onclick='populateModal("+item.id+", \"concluded\")' >"+ itemContentA + arrowDiv +"</div>";
  } else {
    box.innerHTML += "<div class='cb card-box event-box' onclick='populateModal("+item.id+", \"active\")' >"+ itemContentA + arrowDiv +"</div>";
  }
};


function populateModal(id, eventStatus){ // eventStatus is the status of the event (active or concluded) and it is used to define the color of the date tag
  let modalContent = document.getElementById("modal-content"); // get modal content element 
  modalContent.innerHTML = ""; // reset modal content 
  let event = agenda_array.find(x => x.id == id);  // find event in agenda_array with id equal to the id of the event clicked in the card
  let eventTitle = "<h4 id='modal-title'>"+event.title+"</h4>"; // create title and subtitle of the event in the modal
  let eventSubtitle = "<p class='subtitle' id='modal-sbt'>"+event.subtitle+"</p>";
  var modalTitleSubtitle = "<div id='modal-t-sbt-cnt'>"+ eventTitle + eventSubtitle +"</div>"; 
  // create date and place tags of the event in the modal
  let eventDate = "<p class='modal-tag modal-date-"+eventStatus+"'><span class='keyword'>Date: </span>"+event.date+" "+event.time+"</p>";
  let eventPlace = "<p class='modal-tag modal-date-"+eventStatus+"'><span class='keyword'>Place: </span>"+event.place_extended+"</p>";
  // create division and type tags of the event in the modal
  let eventDivision = "<p class='modal-tag'>"+event.division+"</p>"
  let eventType = "<p class='modal-tag'>"+event.type+"</p>"
  let divisionType = "<div id='modal-division-type-cnt'>"+ eventDivision + eventType +"</div>";
  // compose the group of tags of the event in the modal
  let tagGroup = "<div id='modal-tag-group'>"+ divisionType + eventDate + eventPlace +"</div>";
  // Set the main content variable and populate it with the text, image and links of the event
  let mainContent = ""
  let eventText = "<p class='modal-text'>"+event.text+"</p>";
  mainContent += eventText;
  // if event has an image, create the image tag and add it to the main content
  if (event.img){
    let eventImg = "<div id='modal-img-cnt'><img src='"+event.img+"' alt='event presentation image'></div>"; 
    mainContent += eventImg;
  };
  // if event has links, create the links tags and add them to the main content
  let eventLinks = "";
  if (event.downloads){ // if event has download links, create the download links tags and add them to the main content
    event.downloads.forEach(function (evDwnl){
      let aTag = '<a class="boldh-btn secondary-btn" target="_blank" href="'+evDwnl.url+'" download>'+evDwnl.text+'</a>';
      eventLinks += aTag; 
    });
  };
  if (event.urls){ // if event has external links, create the external links tags and add them to the main content
    event.urls.forEach(function (evUrl){
      let aTag = "<a class='boldh-btn dark-btn link-btn target='_blank' href="+evUrl.url+">"+evUrl.text+"<div class='boldh-btn-arrow-cnt'>"+arrow+"</div></a>";
      eventLinks += aTag;
    });
  };
  // if event has links, create the links tags and add them to the main content, else (implicit) do nothing
  if (eventLinks != ""){
    let eventLinksCnt = "<div id='modal-link-group'>"+eventLinks+"</div>";
    mainContent += eventLinksCnt;
  };
  // create html of the main content of the event in the modal and add it as the inner html of the modal content with title, subtitle and tags
  let modalMainContent = "<div id='modal-main-cnt'>"+ mainContent +"</div>"
  modalContent.innerHTML = modalTitleSubtitle + tagGroup + modalMainContent;
  // open modal and display modal content and overlay. Finally disable scroll of the body
  document.getElementById("modal-overlay").style.display = "flex";
  document.getElementById("expansion-container").style.display = "flex";
  document.body.style.overflow = "hidden";
}



// _________________________________________________________________________________________________________________________
// CALLBACK FUNCTIONS
// Callback functions called within the DOMContentLoaded event listener

// _________________________
// NAVBAR LINKS STATE CHANGE
const links = document.querySelectorAll('.nav-link-li a');
const sections = document.querySelectorAll('section');
function changeLinkState() {
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
  if(window.getComputedStyle(elements[0]).display == "none"){ // if nav menu links are not displayed
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block"; // display nav menu links
    };
    // These following lines of code handle the animation of the hamburger menu icon leading from hamburger to cross
    document.getElementById("hamburger").style.display = "block";
    document.getElementById("hamburger").childNodes[1].style.position = 'absolute'
    document.getElementById("hamburger").childNodes[1].style.top = '50%'
    document.getElementById("hamburger").childNodes[1].style.transform = 'rotate(45deg)';
    document.getElementById("hamburger").childNodes[3].style.position = 'absolute'
    document.getElementById("hamburger").childNodes[3].style.top = '50%'
    document.getElementById("hamburger").childNodes[3].style.transform = 'rotate(45deg)';
    document.getElementById("hamburger").childNodes[5].style.position = 'absolute'
    document.getElementById("hamburger").childNodes[5].style.top = '50%'
    document.getElementById("hamburger").childNodes[5].style.transform = 'rotate(-45deg)';
  } else {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none"; // hide nav menu links 
    }
    // These following lines of code handle the animation of the hamburger menu icon leading from cross to hamburger
    document.getElementById("hamburger").style.display = "flex";
    document.getElementById("hamburger").childNodes[1].style.top = '0'
    document.getElementById("hamburger").childNodes[1].style.transform = 'rotate(0)';
    document.getElementById("hamburger").childNodes[3].style.top = 'calc(50% - 1px)';
    document.getElementById("hamburger").childNodes[3].style.transform = 'rotate(0)';
    document.getElementById("hamburger").childNodes[5].style.top = 'calc(100% - 2px)'
    document.getElementById("hamburger").childNodes[5].style.transform = 'rotate(0)';
  }
}