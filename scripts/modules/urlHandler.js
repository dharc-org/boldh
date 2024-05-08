
function handleUrl(id, mode){
    const currentUrl = window.location.href;

    if (mode === "open"){
      updateEvent(id, currentUrl);
    } else {
        closeEvent(currentUrl);
    }
}


function updateEvent(id, currentUrl) {
    if (currentUrl.includes("?event=")) {
      let url = new URL(window.location.href);
      let eventParameterValue = url.searchParams.get('event');
      if (eventParameterValue !== id){
        let newUrl = currentUrl.replace(/event=[^&]+/, 'event='+id);
        window.history.pushState({}, '', newUrl);
      }
    } else {
      var newUrl = currentUrl + "?event="+id;
      window.history.pushState({}, '', newUrl);
    }
}

function closeEvent(currentUrl) {
    if (currentUrl.includes("?event=")) {
      var newUrl = currentUrl.replace(/\?event=[^&]+/, '');
      window.history.pushState({}, '', newUrl);
    }
}

export { handleUrl }