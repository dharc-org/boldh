
// SCROLLING ANIMATIONS
var oldScrollY = window.scrollY;

window.onscroll = function() {

// rotating logo animation
var theta = document.documentElement.scrollTop / 1000 % Math.PI;
document.getElementById('giant-logo').style.transform ='rotate(' + theta + 'rad)';

// moving news on scroll animation
var element = document.getElementById('news-box-container');
if (isInViewport(element)) {
    if(oldScrollY < window.scrollY) {
        document.getElementById('news-box-container').scrollLeft += theta +5; 
    } else {
        document.getElementById('news-box-container').scrollLeft -= theta +5; }
    } 

// moving events agenda on scroll animation
var element = document.getElementById('agenda-box-container');
if (isInViewport(element)) {
    if(oldScrollY < window.scrollY) {
        document.getElementById('agenda-box-container').scrollLeft += theta +5; 
    } else {
        document.getElementById('agenda-box-container').scrollLeft -= theta +5; }
    } 
oldScrollY = window.scrollY;

// definition background color change
var elem = document.querySelector("p#definition-text");
if (isInViewport(elem)) {
    document.getElementById("fourth-section").style.backgroundColor = "black";
    document.getElementsByClassName("text-highlight")[0].style.backgroundColor = "white";
    document.getElementsByClassName("text-highlight")[1].style.backgroundColor = "white";
} 

var reset = document.querySelector("span#reset-viewport");
if (isInViewport(reset)) {
    document.getElementById("fourth-section").style.backgroundColor = "white";
    document.getElementsByClassName("text-highlight")[0].style.backgroundColor = "white";
    document.getElementsByClassName("text-highlight")[1].style.backgroundColor = "white";
} 

// agenda background color change -- to remove if news-agenda hidden
var agenda_title = document.querySelector("h2#agenda-main-title");
    if (isInViewport(agenda_title)) {
        document.getElementById("seventh-section").style.backgroundColor = "#FA3005";
        document.getElementById("sixth-section").style.backgroundColor = "#FA3005";
        document.getElementById("contacts-section").style.backgroundColor = "#FA3005";
    }

// contacts background color change
var contacts_title = document.querySelector("h2#contacts-main-title");
if (isInViewport(contacts_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidden
    document.getElementById("sixth-section").style.backgroundColor = "#7EE787";// to remove if news-agenda hidden
    //document.getElementById("contacts-section").style.backgroundColor = "#7EE787";
    //document.getElementById("fifth-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda NOT hidden
} else {
    //document.getElementById("contacts-section").style.backgroundColor = "black"; // to remove if news-agenda NOT hidden
    //document.getElementById("fifth-section").style.backgroundColor = "black"; // to remove if news-agenda NOT hidden
}

// news background color change -- to remove if news-agenda hidden
var news_title = document.querySelector("h2#news-main-title");
    if (isInViewport(news_title)) {
        document.getElementById("seventh-section").style.backgroundColor = "black";
        document.getElementById("sixth-section").style.backgroundColor  = "black";
        document.getElementById("contacts-section").style.backgroundColor  = "black";
    }


}


// add animations when entering viewport
function isInViewport(elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

var news_array = []

// FETCH DATA FROM JSON

// news data
fetch("/content/news.json")
.then(res => res.json())
.then(data => {
  news_array = data;
 })
.then(() => {
  news_array.forEach(function (news_item) {
    var url = "<a class='news-box-anchor' href='https://www.google.it/' target='_blank'>"
    var date = "<p class='news-date'>" + news_item.date + "</p>";
    var division = "<p class='news-division'>" + news_item.division + "</p>";
    var title = "<h3 class='news-title'>" + news_item.title  + "</h3>";
    var text = "<p class='news-text'>" + news_item.text + "</p>";

    var news_box = document.getElementById('news-box-container');
    news_box.innerHTML += url + "<div class='news-box'>" + date + division + title + text + "</div></a>";
  }); 
  });


// agenda data
  fetch("/content/agenda.json")
  .then(res => res.json())
  .then(data => {
    news_array = data;
   })
  .then(() => {
    news_array.forEach(function (news_item) {
      var status = "";
      var statusElem = ""
      if (news_item.status === "concluded") {
        status = "concluded"
        statusElem = "<p class='agenda-concluded'>CONCLUDED</p>";
      }
      var url = "<a class='agenda-box-anchor' href='https://www.google.it/' target='_blank'>"
      var date = "<p class='agenda-date'>" + news_item.date + "</p>";
      var division = "<p class='agenda-division'>" + news_item.division + "</p>";
      var type = "<p class='agenda-type'>" + news_item.type + "</p>";
      var title = "<h3 class='agenda-title'>" + news_item.title  + "</h3>";
      var text = "<p class='agenda-text'>" + news_item.text + "</p>";
      var news_box = document.getElementById('agenda-box-container');
      news_box.innerHTML += url + "<div class='agenda-box " + status +"'>" + statusElem + date + division + type + title + text + "</div></a>";
    }); 
    });
console.log("ready hello");
