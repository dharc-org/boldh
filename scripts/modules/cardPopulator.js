// DIVIDE EVENTS IN ACTIVE AND CONCLUDED EVENTS AND SORT THEM BY DATE
export function divideEvents(agendaArray) {
  let activeArr = []
  let concludedArr = []
  // divide events inconcluded or active array
  agendaArray.forEach(function (event) {
    let endDate
    let parts
    if (event.date.includes('-')) {
      // if event is a range of dates, take the last date of the range as the end date
      let dateRange = event.date.split('-')
      endDate = dateRange[1].trim()
    } else {
      endDate = event.date.trim()
    }
    parts = endDate.split('/')
    endDate = new Date(parts[2], parts[1] - 1, parts[0]) // create a date object from the end date of the event
    let today = new Date()
    endDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    // if end date is before today, event is concluded, else it is active
    if (endDate < today) {
      concludedArr.push(event)
    } else {
      activeArr.push(event)
    }
  })
  return [activeArr, concludedArr]
}

export function sortEvents(eventsArray) {
  eventsArray.sort(function (a, b) {
    // Convert string into date object
    function convertToDate(dateString) {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, day);
    }

    // Extract start and end date from strings of dates
    // If a single date is present, endDate is undefined
    const [startDateA, endDateA] = a.date.split('-').map(date => date.trim());
    const [startDateB, endDateB] = b.date.split('-').map(date => date.trim());

    // Create dates for events
    const dateA = endDateA ? convertToDate(endDateA) : convertToDate(a.date);
    const dateB = endDateB ? convertToDate(endDateB) : convertToDate(b.date);

    // Ordina gli eventi in base alla data
    return dateB - dateA;
  });

  return eventsArray;
}

// POPULATE CARDS WITH DATA FROM JSON AND ADD THEM TO THE WEBSITE
const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="50" viewBox="0 0 66 50" fill="none"><path d="M0 25H64M64 25L41.7391 1M64 25L41.7391 49" stroke="#F2F2F2" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>'

export function populateCard(itemType, item) {
  
  const cardContainer = (itemType === 'news') ? document.getElementById('news-box-container') : document.getElementById('agenda-box-container');
  const cardDivision = "<p class='card-division'>" + item.division + '</p>'
  const cardType = "<p class='card-type'>" + item.type + '</p>'
  const cardTitle = "<h4 class='card-title'>" + item.title + "</h4>"
  const cardText = (itemType === 'news') ? "<p class='card-text'>" + item.text + '</p>' : "<p class='card-text'>" + item.subtitle + '</p>';
  // Create html element containing title and text of the card
  const cardTextDiv = "<div class='card-text-div'>" + cardTitle + cardText + '</div>'

  let cardInfo;
  if (itemType === 'news') {
    cardInfo = "<div class='card-info-div'>" + cardDivision + cardType + '</div>' // I put division tag and type of news in the tag info div for news
  } else {
    const eventDate = "<p class='agenda-" + itemType + "'>" + item.date + '</p>' 
    const eventPlace = "<p class='card-place'>" + item.place + '</p>' // I define the place tag for both kinds of events
    cardInfo = "<div class='card-info-div'>" + cardDivision + cardType + eventPlace + eventDate + '</div>' // I put division tag, type of event, place and date in the tag info div for events
  }
  // Create html elements containing main content and link arrow
  const cardTextualBlock = "<div class='card-box-content-a'>" + cardInfo + cardTextDiv + '</div>'
  const arrowContainer = "<div class='card-arrow-cnt'>" + arrow + '</div>'
  // create content depending on the itemType
  const cardContent = (itemType === 'news') ? "<a class='cb card-box news-box' href='" + item.url + "' target='_blank'>" + cardTextualBlock + arrowContainer + '</a>' : cardTextualBlock + arrowContainer;
  
  return [cardContainer, cardContent]
}


export function populateModal(id, eventStatus, agendaArray) {
  // eventStatus is the status of the event (active or concluded) and it is used to define the color of the date tag
  const modalContent = document.getElementById('modal-content')
  modalContent.innerHTML = '' // reset modal content

  const event = agendaArray.find((x) => x.id === id) // find event in agendaArray with id
  const eventTitleSubtitle = `<div id='modal-t-sbt-cnt'><h4 id='modal-title'>${event.title}</h4><p class='subtitle' id='modal-sbt'>${event.subtitle}</p></div>`;
  // create date and place tags of the event in the modal
  const eventDate = `<p class='modal-tag modal-date-${eventStatus}'>${event.date} ${event.time}</p>`;
  const eventPlace = `<p class='modal-tag modal-date-${eventStatus}'>${event.place_extended}</p>`;
  // create division and type tags of the event in the modal
  const divisionType = `<div id='modal-division-type-cnt'><p class='modal-tag'>${event.division}</p><p class='modal-tag'>${event.type}</p></div>`;
  // compose the group of tags of the event in the modal
  const tagGroup = `<div id='modal-tag-group'>${divisionType}${eventDate}${eventPlace}</div>`;

  // Set the main content variable and populate it with the text, image and links of the event
  let mainContent = event.text

  // if event has an image, create the image tag and add it to the main content
  if (event.image) {
    const eventImg = `<div id='modal-img-cnt'><img src='${event.image.url}' alt='${event.image.alt}'></div>`;
    mainContent += eventImg;
  }
  // if event has links, create the links tags and add them to the main content
  let eventLinks = ''
  if (event.downloads) {
    event.downloads.forEach((evDwnl) => {
      const aTag = `<a class="boldh-btn secondary-btn" href="${evDwnl.url}" download >${evDwnl.text}</a>`;
      eventLinks += aTag
    })
  }
  if (event.urls) {
    event.urls.forEach((evUrl) => {
      const aTag = `<a class='boldh-btn dark-btn link-btn' target="_blank" href="${evUrl.url}">${evUrl.text}<div class='boldh-btn-arrow-cnt'>${arrow}</div></a>`;
      eventLinks += aTag;
    });
  }
  // if event has links, create the links tags and add them to the main content, else (implicit) do nothing
  if (eventLinks) {
    const eventLinksCnt = `<div id='modal-link-group'>${eventLinks}</div>`;
    mainContent += eventLinksCnt;
  }
  // create html of the main content and add it to the modal content with title, subtitle and tags
  const modalMainContent = `<div id='modal-main-cnt'>${mainContent}</div>`;
  modalContent.innerHTML = eventTitleSubtitle + tagGroup + modalMainContent;

  // open modal and display modal content and overlay. Finally disable scroll of the body
  document.getElementById('modal-overlay').classList.add('modal-overlay-show');
  document.getElementById('expansion-container').classList.add('expansion-container-show');
  document.body.style.overflow = 'hidden'
}
