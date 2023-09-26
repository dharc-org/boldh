//  Start Open Web Analytics Tracker

var owa_baseUrl = 'https://www2.classics.unibo.it/stats/';
var owa_cmds = owa_cmds || [];
owa_cmds.push(['setSiteId', '0b1816cbc8f93d5a1963a49b0388ae7a']);
owa_cmds.push(['trackPageView']);
owa_cmds.push(['trackClicks']);

(function() {
    var _owa = document.createElement('script'); _owa.type = 'text/javascript'; _owa.async = true;
    owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') : owa_baseUrl );
    _owa.src = owa_baseUrl + 'modules/base/dist/owa.tracker.js';
    var _owa_s = document.getElementsByTagName('script')[0]; _owa_s.parentNode.insertBefore(_owa, _owa_s);
}());
