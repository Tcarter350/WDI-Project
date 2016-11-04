console.log("JS loaded!");
$(() => {

  let today = new Date();
  let dateBounds = new Date(new Date(today).setMonth(today.getMonth()+1));
  let googleMap = googleMap || {};
  let range = new Date(new Date(today).setDate(today.getDate()+2));
  let $main = $('main');
  let $sidebar =$(".sidebar");
  let $loginForm = $('nav');
  $main.on('submit', 'form', handleForm);
  $sidebar.on('submit', 'form', handleForm);
  $loginForm.on('submit', 'form', handleForm);
  $sidebar.on('click', 'button.delete', deleteUser);
  $sidebar.on('click', 'button.edit', getUser);
  $sidebar.on('click', 'button.dateButton', dateSetup);
  $('.usersIndex').on('click', getUsers);
  $('.logOut').on('click', logout);
  $('.datePic').on('click', selectNewDate);
  let markers = [];
  let circle = [];

  let eventCircle = {
    lat: undefined,
    lng: undefined
  };


  createMap();
  dateSlider();


  let $mapDiv =$('#map');
  let eventMarkers = [];

  let map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 14,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ]
  });

  function dateSetup(data) {
    let partnerLat = $(this).data('lat');
    let partnerLng = $(this).data('lng');
    let partnerLatLng = {
      lat: partnerLat,
      lng: partnerLng
    };
    let partnerImg = $(this).data('img');
    createEventRadius(partnerLatLng);
    setDatePic(partnerImg);
    removeCover();
    $('.sidebar').hide();
  }

  function setDatePic(partnerImg) {
    $('.datePic').show();
    $('.datePic').css('background-image', 'url(' + partnerImg + ')');
    $('.datePic').css('border', '2px solid grey');
  }

  function createMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
      let latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.panTo(latLng);
    });
  }

  function dateSlider() {
    $("#slider").dateRangeSlider({
      bounds:{
        min: today,
        max: dateBounds
      },
      defaultValues: {
        min: today,
        max: range
      }
    });

    $("#slider").bind("userValuesChanged", function(e, data){
      // get new events from API
      let min = data.values.min;
      let max = data.values.max;

      getEvents(min, max);
    });
  }

  function removeMarkers(){
    for (var i = 0; i < eventMarkers.length; i++) {
      eventMarkers[i].setMap(null);
    }
    eventMarkers = [];
  }

  function getEvents(min, max) {
    removeMarkers();
    let minDate = min.toISOString().split('T')[0];
    let maxDate = max.toISOString().split('T')[0];

    console.log('getting events');
    $.ajax({
      url: `/events`,
      data: {
        latitude: eventCircle.lat,
        longitude: eventCircle.lng,
        radius: 1,
        limit: 100,
        minDate: minDate,
        maxDate: maxDate
      },
      method: "GET"
    }).done(function (data) {
      console.log(data);
      addEventMarkers(data);
    }).fail(function () {
      console.log('Skiddle call failed, arguments:', arguments);
    });
  }

  function addEventMarkers(events) {
    events.forEach((event, index) => {
      let latLng =  {
        lat: event.venue.latitude,
        lng: event.venue.longitude
      };
      setTimeout(function dropMarker(){
        let marker = new google.maps.Marker({
          position: latLng,
          icon: "../images/greymarker.png",
          // animation: google.maps.Animation.BOUNCE,
          map
        });
        googleMap.addInfoWindowForEvent(event, marker);
        eventMarkers.push(marker);
      }, 70 * index);
      // let marker = new google.maps.Marker({
      //   position: latLng,
      //   map
      // });

    });
  }

  $('.mapCover').on('click', removeCover);
  function removeCover() {
    $('.mapCover').hide();
    $('.mainBox').hide();
  }

  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  if(isLoggedIn()) {
    getUsers();
    toggleNav();
  } else {
    // showLoginForm();
  }

  function showLoginForm() {
    if(event) event.preventDefault();
  }

  function handleForm() {
    if(event) event.preventDefault();
    let token = localStorage.getItem('token');
    let $form = $(this);
    let url = $form.attr('action');
    let method = $form.attr('method');
    let data = $form.serialize();
    $.ajax({
      url,
      method,
      data,
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    }).done((data) => {
      if(data.token) localStorage.setItem('token', data.token);
      if(data.user) localStorage.setItem('userId', data.user._id);
      getUsers ();
      if (url === "/login" || url === "/register"){
        toggleNav();
      }
    }).fail(() => {
      $('#loginPassword').val('');
    });
  }

  function toggleNav() {
    $('.logOut').toggle();
    $('.logIn').toggle();
  }

  function getUsers() {
    if (event) event.preventDefault();
    let token = localStorage.getItem('token');
    $.ajax({
      url: `/users`,
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showUsers)
    .fail(showLoginForm);
  }

  function showUsers(users) {
    removeCover();
    let loggedInUserId = localStorage.getItem('userId');

    let $row = $('<div class="row"></div>');
    users.forEach((user) => {

      if(user._id !== loggedInUserId) {
        $row.append(`
          <div class="user-profile">
          <img class="card-img-top" src="${user.profilePic}" alt="Card image cap"></br>
          <h2 class="card-title">${user.firstName}</h2></br>
          <h4 class="card-title">${user.gender}</h4></br>
          <h2 class="card-title">${user.age}</h2></br>
          <h4 class="card-title">Fun Fact: ${user.fact}</h4></br>
          <h4 class="card-title">Interested In: ${user.interestedIn}</h4></br>
          <button class="dateButton" data-id="${user._id}" data-img="${user.profilePic}" data-lat="${user.lat}" data-lng="${user.lng}">Date</button>
          </div>
          `
        );
      } else {
        $row.prepend(`
          <div class="user-profile user">
          <img class="card-img-top" src="${user.profilePic}" alt="Card image cap">
          <h2 class="card-title">${user.firstName}</h2>
          <button class="delete" data-id="${user._id}">Delete</button>
          <button class="edit" data-id="${user._id}">Edit</button>
          </div>
          `
        );
      }
    });
    $(".sidebar").html($row);
  }

  function selectNewDate(){
    $('.sidebar').toggle();
    $('.datePic').hide();
    dateReset();
  }

  function dateReset() {
    removeMarkers();
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    circle[0].setMap(null);
    circle = [];
  }

  function getUser() {
    let id = $(this).data('id');
    let token = localStorage.getItem('token');
    $.ajax({
      url: `/users/${id}`,
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showEditForm)
    .fail(showLoginForm);
  }

  function showEditForm(user) {
    if(event) event.preventDefault();
    console.log(user);
    $sidebar.html(`
      <h2>Edit Profile</h2>
      <form method="put" action="/users/${user._id}">
      <div class="form-group">
      <input class="form-control" name="firstName" placeholder="Firstname" value="${user.firstName}">
      </div>
      <div class="form-group">
      <input class="form-control" name="lastName" placeholder="Last Name" value="${user.lastName}">
      </div>
      <div class="form-group">
      <input class="form-control" name="email" placeholder="Email" value="${user.email}">
      </div>
      <div class="form-group">
      <input class="form-control" name="age" placeholder="Age e.g 21" value="${user.age}">
      </div>
      <div class="form-group">
      <input class="form-control" name="gender" placeholder="Male or Female?" value="${user.gender}">
      </div>
      <div class="form-group">
      <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?" value="${user.interestedIn}">
      </div>
      <div class="form-group">
      <input class="form-control" name="postcode" placeholder="Postcode" value="${user.postcode}">
      </div>
      <div class="form-group">
      <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!" value="${user.fact}">
      </div>
      <div class="form-group">
      <input class="form-control" name="profilePic" placeholder="Image Url" value="${user.profilePic}">
      </div>
      <button class="btn btn-primary">Update</button>
      </form>
      `
    );
  }

  function deleteUser() {
    let id = $(this).data('id');
    let token = localStorage.getItem('token');
    $.ajax({
      url: `/users/${id}`,
      method: "DELETE",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(getUsers)
    .fail(showLoginForm);
  }

  function logout() {
    if(event) event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    location.reload();
  }

  function createEventRadius(partnerLatLng){
    console.log(partnerLatLng);
    google.maps.Circle.prototype.contains = function(latLng) {
      return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
    let bounds = new google.maps.LatLngBounds();
    navigator.geolocation.getCurrentPosition(function(position) {
      let loctn = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      markers.push(new google.maps.Marker({
        map: map,
        position: loctn,
        icon: '../images/heartpinsmall.png'

      }));
      markers.push(new google.maps.Marker({
        map: map,
        position: partnerLatLng,
        icon: '../images/heartpinsmall.png'

      }));
      markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });
      let centerOfBounds = bounds.getCenter();
      // console.log("centerOfBounds", centerOfBounds);
      // console.log(this.getCenter());

      circle.push(new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.65,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: map,
        center: centerOfBounds,
        radius: 2110
      }));

      map.panTo(centerOfBounds);

      console.log(today);
      console.log(range);
      eventCircle.lat = centerOfBounds.lat();
      eventCircle.lng = centerOfBounds.lng();
      getEvents(today, range);

    });
  }

  googleMap.addInfoWindowForEvent = function (event, marker) {
  google.maps.event.addListener(marker, "click", () => {
    if (this.infowindow){
      this.infowindow.close();
    }
    this.infowindow = new google.maps.InfoWindow({
      content: `
        <div class="eventInfoBox">
          <img src=${event.largeimageurl} onerror="this.src='../images/noimage.jpg'">
          <div class="content">
            <h2><strong>${event.eventname}</strong></h2><br>
            <h4>${event.description}</h4></br>
            <h3>${event.venue.name}</h3>
            <p>${event.date}</p>
            <p>${event.venue.address}</p>
            <p>${event.venue.town}</p>
            <p>${event.venue.postcode}</p>
            <p>${event.venue.phone}</p>
            <a href=${event.link} target="_blank">Get Tickets</a>
          </div>
        </div>
      `
      });
      this.infowindow.open(this.map, marker);
    });
  };
});
