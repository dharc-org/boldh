
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

var obj = []
// FETCH DATA FROM JSON
fetch("/content/news.json")
.then(res => res.json())
.then(data => {
  obj = data;
 })
.then(() => {
  console.log(data);
  var div = document.getElementById('news-box-container');
  div.innerHTML += "<div class='news-box'><h3 class='news-division'>✪ Division</h3><h3 class='news-text'>Hello hello</h3></div>";
 });

console.log("ready ready");
console.log(obj);
