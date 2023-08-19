
// scrolling logo in second section

window.onscroll = function() {
    var theta = document.documentElement.scrollTop / 1000 % Math.PI;
document.getElementById('giant-logo').style.transform ='rotate(' + theta + 'rad)';
}

// add animations when entering viewport

