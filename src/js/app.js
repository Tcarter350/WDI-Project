console.log("JS loaded!");
$(() =>{
  let $mapDiv =$('#map');
  console.log($mapDiv);
  let map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 16
  });
  navigator.geolocation.getCurrentPosition(function(position) {
    let latLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    map.panTo(latLng);
    let marker = new google.maps.Marker({
      position: latLng,
      animation: google.maps.Animation.BOUNCE,
      draggable: true,
      map
    });
  });
  let $main = $('main');
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $main.on('submit', 'form', handleForm);
  $main.on('click', 'button.delete', deleteUser);
  $main.on('click', 'button.edit', getUser);
  $('.usersIndex').on('click', getUsers);
  $('.logout').on('click', logout);
  $('.sharksIndex').on('click', getSharks);
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  if(isLoggedIn()) {
    getUsers();
  } else {
    showLoginForm();
  }
  function showRegisterForm() {
    if(event) event.preventDefault();
    $main.html(`
      <h2>Register</h2>
      <form method="post" action="/register">
        <div class="form-group">
          <input class="form-control" name="firstName" placeholder="First Name">
        </div>
        <div class="form-group">
          <input class="form-control" name="lastName" placeholder="Last Name">
        </div>
        <div class="form-group">
          <input class="form-control" name="email" placeholder="Email">
        </div>
        <div class="form-group">
          <input class="form-control" name="age" placeholder="Age e.g 21">
        </div>
        <div class="form-group">
          <input class="form-control" type="password" name="password" placeholder="Password">
        </div>
        <div class="form-group">
          <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
        </div>
        <div class="form-group">
          <input class="form-control" name="gender" placeholder="Male or Female?">
        </div>
        <div class="form-group">
          <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?">
        </div>
        <div class="form-group">
          <input class="form-control" name="postcode" placeholder="Postcode">
        </div>
        <div class="form-group">
          <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!">
        </div>
        <div class="form-group">
          <input class="form-control" name="profilePic" placeholder="Upload your image here">
        </div>
        <button class="btn btn-primary">Register</button>
      </form>
    `);
  }
  function showLoginForm() {
    if(event) event.preventDefault();
    $main.html(`
      <h2>Login</h2>
      <form method="post" action="/login">
        <div class="form-group">
          <input class="form-control" name="email" placeholder="Email">
        </div>
        <div class="form-group">
          <input class="form-control" type="password" name="password" placeholder="Password">
        </div>
        <button class="btn btn-primary">Register</button>
      </form>
    `);
  }
  function showEditForm(user) {
    if(event) event.preventDefault();
    $main.html(`
      <h2>Edit User</h2>
      <form method="put" action="/users/${user._id}">
        <div class="form-group">
          <input class="form-control" name="username" placeholder="Username" value="${user.username}">
        </div>
        <button class="btn btn-primary">Update</button>
      </form>
    `);
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
      getUsers();
    }).fail(showLoginForm);
  }
  function getUsers() {
    if(event) event.preventDefault();
    let token = localStorage.getItem('token');
    $.ajax({
      url: '/users',
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showUsers)
    .fail(showLoginForm);
  }
  function getSharks() {
    if(event) event.preventDefault();
    let token = localStorage.getItem('token');
    $.ajax({
      url: '/sharks',
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showSharks)
    .fail(showLoginForm);
  }
  function showUsers(users) {
    console.log(users);
    let $row = $('<div class="row"></div>');
    users.forEach((user) => {
      $row.append(`
        <div class="col-md-4">
          <div class="card">
            <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
            <div class="card-block">
              <h4 class="card-title">${user.firstName}</h4>
            </div>
          </div>
          <button class="btn btn-danger delete" data-id="${user._id}">Delete</button>
          <button class="btn btn-primary edit" data-id="${user._id}">Edit</button>
        </div>
      `);
    });
    $main.html($row);
  }
  function showSharks(sharks) {
    console.log(sharks);
    let $row = $('<div class="row"></div>');
    sharks.forEach((shark) => {
      $row.append(`
        <div class="col-md-4">
          <div class="card">
            <img class="card-img-top" src="${shark.image}" alt="Card image cap">
            <div class="card-block">
              <h4 class="card-title">${shark.species}</h4>
            </div>
            <div class="card-block">
              <h4 class="card-title">${shark.maxLength} feet</h4>
            </div>
          </div>
          <button class="btn btn-danger delete" data-id="${shark._id}">Delete</button>
          <button class="btn btn-primary edit" data-id="${shark._id}">Edit</button>
        </div>
      `);
    });
    $main.html($row);
  }
  showSharks();
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
  function logout() {
    if(event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }

  google.maps.Circle.prototype.contains = function(latLng) {
    return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
  };

  let bounds = new google.maps.LatLngBounds();

  let markers = [];

  markers.push(new google.maps.Marker({
    map: map,
    position: { lat: 51.55, lng: -0.078 }
  }));

  markers.push(new google.maps.Marker({
    map: map,
    position: { lat: 51.45, lng: -0.078 }
  }));

  markers.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });

  let centerOfBounds = bounds.getCenter();

  new google.maps.Marker({
    map: map,
    position: centerOfBounds,
    animation: google.maps.Animation.DROP
  });

  let circle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: centerOfBounds,
    radius: 1000
  });

  console.log(circle.contains(markers[1].getPosition()));

});
