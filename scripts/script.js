// SCROLLING ANIMATIONS
var oldScrollY = window.scrollY;

window.onscroll = function () {
  // rotating logo animation
  var theta = (document.documentElement.scrollTop / 1000) % Math.PI;
  document.getElementById("giant-logo").style.transform = "rotate(" + theta + "rad)";

  // moving news on scroll animation
  var element = document.getElementById("news-box-container");
  if (isInViewport(element)) {
    if (oldScrollY < window.scrollY) {
      document.getElementById("news-box-container").scrollLeft += theta + 10;
    } else {
      document.getElementById("news-box-container").scrollLeft -= theta + 10;
    }
  }
  // moving events agenda on scroll animation
  var element = document.getElementById("agenda-box-container");
  if (isInViewport(element)) {
    if (oldScrollY < window.scrollY) {
      document.getElementById("agenda-box-container").scrollLeft += theta + 10;
    } else {
      document.getElementById("agenda-box-container").scrollLeft -= theta + 10;
    }
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

/*
  // agenda background color change -- to remove if news-agenda hidden
  var agenda_title = document.querySelector("h2#agenda-main-title");
  if (isInViewport(agenda_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "#FA3005";
    document.getElementById("sixth-section").style.backgroundColor = "#FA3005";
    document.getElementById("contacts-section").style.backgroundColor = "#FA3005";
  }
*/
  var contacts_title = document.querySelector("h2#contacts-main-title");
  if (isInViewport(contacts_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidden
    document.getElementById("sixth-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidden
    document.getElementById("contacts-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda hidde
    //document.getElementById("fifth-section").style.backgroundColor = "#7EE787"; // to remove if news-agenda NOT hidden
  } else {
    //document.getElementById("contacts-section").style.backgroundColor = "black"; // to remove if news-agenda NOT hidden
    //document.getElementById("fifth-section").style.backgroundColor = "black"; // to remove if news-agenda NOT hidden
  }

  // news background color change -- to remove if news-agenda hidden
  var news_title = document.querySelector("h2#news-main-title");
  if (isInViewport(news_title)) {
    document.getElementById("seventh-section").style.backgroundColor = "black";
    document.getElementById("sixth-section").style.backgroundColor = "black";
    document.getElementById("contacts-section").style.backgroundColor = "black";
  }
  
};

// add animations when entering viewport
function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

var news_array = [];

// FETCH DATA FROM JSON

// news data
fetch("/content/news.json")
  .then((res) => res.json())
  .then((data) => {
    news_array = data;
  })
  .then(() => {
    news_array.forEach(function (news_item) {
      console.log("HELLOOOO");
      populateCard("news", news_item);
    });
  });


// agenda data
fetch("/content/agenda.json")
  .then((res) => res.json())
  .then((data) => {
    agenda_array = data;
  })
  .then(() => {
    agenda_array.forEach(function (agenda_item) {
      populateCard("agenda", agenda_item);
    });
  });




function populateCard(tp, item) {
  console.log(tp, item);
  let itemDivision = "<p class='card-division'>" + item.division + "</p>";
  let itemType = "<p class='card-type'>" + item.type + "</p>";
  let arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="51" viewBox="0 0 66 51" fill="none"><path d="M0 25.3613H64M64 25.3613L41.7391 1.36133M64 25.3613L41.7391 49.3613" stroke="#F2F2F2" stroke-width="2"/></svg>';
  
  let itemTitle = "";
  if (item.title.length > 80) {
    let newTitle = item.title.substring(0, 80) + "...";
    itemTitle = "<h3 class='card-title'>" + newTitle + "</h3>";;
  } else {
    itemTitle = "<h3 class='card-title'>" + item.title + "</h3>";
  }

  let itemText = "";
  if (item.text.length > 200) {
    let newText = item.text.substring(0, 200) + "...";
    itemText = "<p class='card-text'>" + newText + "</p>";
  } else {
    itemText = "<p class='card-text'>" + item.text + "</p>";
  }

  let itemTextDiv = "<div class='card-text-div'>"+ itemTitle + itemText +"</div>";
  let box = "";
  let infoDiv = "";

  if (tp == "news") {
    box = document.getElementById("news-box-container");
    infoDiv = "<div class='card-info-div'>" + itemDivision + itemType +"</div>";
  } else {
    box = document.getElementById("agenda-box-container");
    var status = "";
    if (item.status == "concluded") {
      status = "Concluded";
    } else {
      status = "Upcoming";
    }
    let itemStatus = "<p class='agenda-"+status+"'>"+status+"</p>";
    let itemDate = "<p class='card-date'>" + item.date + "</p>";
    let itemPlace = "<p class='card-place'>" + item.place + "</p>";
    infoDiv = "<div class='card-info-div'>" + itemDate + itemPlace + itemDivision + itemType + itemStatus +"</div>";
  }
  
  let itemContentA = "<div class='card-box-content-a'>"+ infoDiv + itemTextDiv +"</div>";
  let arrowDiv = "<div class='card-arrow-div'>"+ arrow +"</div></div>";

  if (tp == "news") {
    let itemUrl = item.url;
    box.innerHTML += "<a class='card-box' href='"+ itemUrl +"' target='_blank' onmouseover='animateCardOver(this)' onmouseout='reverseAnimateCard(this)'>"+ itemContentA + arrowDiv +"</a>";
  } else {
    if (status == "Concluded"){
      box.innerHTML += "<div class='card-box-concluded' onmouseover='animateCardOver(this, \"concluded\")' onmouseout='reverseAnimateCard(this, \"concluded\")' onclick='populateModal(\"event\", "+item.id+")' >"+ itemContentA + arrowDiv +"</div>";
    } else {
      box.innerHTML += "<div class='card-box event-box' onmouseover='animateCardOver(this, \"active\")' onmouseout='reverseAnimateCard(this, \"active\")' onclick='populateModal(\"event\", "+item.id+")' >"+ itemContentA + arrowDiv +"</div>";
    }
  }
};


function populateModal(type, id){
  console.log(type, id);
  var modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";
  if (type == 'news'){
    var item = news_array.find(x => x.id == id);
    if (item.subtitle){
      var modalTitleSubtitle = "<div id='modal-t-sbt-cnt'><h4 id='modal-title'>"+item.title+"</h4><p id='modal-sbt'>"+item.subtitle+"</p></div>";
    } else {
      var modalTitleSubtitle = "<h3 id='modal-title'>"+item.title+"</h3>";
    }
    if (item.date){
      var tagGroup = "<div id='modal-tag-group'><div class='modal-tag-cnt' id='tag-date'><p>"+item.date+"</p></div><div class='modal-tag-cnt' id='tag-division'><p>"+item.division+"</p></div></div>"
    } else {
      var tagGroup = "<div id='modal-tag-group'><div class='modal-tag-cnt' id='tag-division'><p>"+item.division+"</p></div></div>"
    }
    var modalMainContent = "<div id='modal-main-cnt'><p class='modal-text'>"+item.text+"</p><div id='modal-link-group'><a class='boldh-a' target='_blank' href='"+item.url+"'>Go to the news</a></div></div>"
    modalContent.innerHTML = modalTitleSubtitle + tagGroup + modalMainContent;
  } else {
    var item = agenda_array.find(x => x.id == id);
    var modalTitleSubtitle = "<div id='modal-t-sbt-cnt'><h4 id='modal-title'>"+item.title+"</h4><p id='modal-sbt'>"+item.subtitle+"</p></div>";
    if (item.status == "concluded"){
      var tagGroup = "<div id='modal-tag-group'><div class='modal-tag-cnt' id='tag-concluded'><p>Concluded</p></div><div class='modal-tag-cnt' id='tag-date'><p>"+item.date+"</p></div><div class='modal-tag-cnt' id='tag-division'><p>"+item.division+"</p></div></div>"
    } else {
      var tagGroup = "<div id='modal-tag-group'><div class='modal-tag-cnt' id='tag-date'><p>"+item.date+"</p></div><div class='modal-tag-cnt' id='tag-division'><p>"+item.division+"</p></div></div>"
    }
    if (item.img){
      var modalMainContent = "<div id='modal-main-cnt'><div id='modal-img-cnt'><img src='"+item.img+"' alt='event presentation image'></div><p class='modal-text'>"+item.text+"</p><div id='modal-link-group'><a class='boldh-a' target='_blank' href='"+item.url+"'>Go to the news</a></div></div>"
    } else {
      var modalMainContent = "<div id='modal-main-cnt'><p class='modal-text'>"+item.text+"</p><div id='modal-link-group'><a class='boldh-a' target='_blank' href='"+item.url+"'>Go to the news</a></div></div>"
    }
    modalContent.innerHTML = modalTitleSubtitle + tagGroup + modalMainContent;
  }

  document.getElementById("modal-overlay").style.display = "flex";
  document.getElementById("expansion-container").style.display = "flex";
}

function closeModal(){
  document.getElementById("modal-overlay").style.display = "none";
  document.getElementById("expansion-container").style.display = "none";
  document.getElementById("modal-content").innerHTML = "";
}





function openMenu(){
  console.log("open menu")
  let elements = document.getElementsByClassName("nav-link-li");
  if(window.getComputedStyle(elements[0]).display == "none"){
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    };
  }else{
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }
}



function animateCardOver(x, type){
  if (type == "active"){
    x.style.backgroundColor = "#292929"
    x.style.borderColor = "transparent"
  }
  x.childNodes[1].style.paddingLeft = "1.2rem"
}

function reverseAnimateCard(x, type){
  if (type == "active"){
    x.style.backgroundColor = "#252525"
    x.style.borderColor = "white"
  }
  x.childNodes[1].style.paddingLeft = "0"
}