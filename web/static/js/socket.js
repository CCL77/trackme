// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let name = prompt("Your name?")
let map;
let marker;
let channel = socket.channel("tracker:lobby", {name: name})



window.channel = channel;

channel.join()
.receive("ok", resp => { console.log("Joined successfully", resp) })

function initializeMapAndLocator() {

  var markers = {};
  var mymarker;
  map = L.map('map')
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.locate({setView: true, maxZoom: 16});



  function onLocationFound(e) {
    var radius = e.accuracy / 2;
    map.locate({
        setView: false,
        timeout: 60000,
        enableHighAccuracy: true
    });
    var coords = e.coords;
    var newlatlng = e.latlng;
    const new_lat = newlatlng.lat;
    const new_lng = newlatlng.lng;

    // var Details = {
    //     username: username,
    //     active: true,
    //     new_lat: new_lat,
    //     new_lng: new_lng,
    //     update: true
    // };

    channel.push(("move"), {
      name: name,
      coords: {
        latitude: new_lat,
        longitude: new_lng
      }
    })

    if (map.hasLayer(mymarker)) {
      map.removeLayer(mymarker);
    }

    // mymarker = new L.circle([coords.lat,coords.lng], {radius:1000})
    mymarker = new L.circle([new_lat,new_lng], {radius:10})


    
    // mymarker.addTo(map);
    map.addLayer(mymarker);
    mymarker.bindPopup('<p>You are here ' + name + '</p>').openPopup();
  }

  map.on('locationfound', onLocationFound);

    //socket.emit('new_coords', Details);
    

  channel.on("moved", resp => {
    if (map.hasLayer(markers[resp.name])) {
        map.removeLayer(markers[resp.name]);
    }
    console.log(markers)
    console.log(resp.coords.latitude)
    console.log(resp.coords.longitude)

      
    markers[resp.name] = new L.circle([resp.coords.latitude,resp.coords.longitude], {radius:10})
    map.addLayer(markers[resp.name]);
    markers[resp.name].bindPopup(resp.name + ' is on the move').openPopup();
    console.log(resp.name)
    console.log(`Moved ${resp.name} to ${resp.coords.latitude}, ${resp.coords.longitude}`, resp.coords);
  })
    



    // if (map.hasLayer(mymarker)) {
    //     map.removeLayer(mymarker);
    // }

    // mymarker = new L.Marker(e.latlng, {
    //     icon: yellowIcon,
    //     draggable: true
    // });

    // map.addLayer(mymarker);
    // mymarker.bindPopup('<p>You are here ' + username + '</p>').openPopup();
  


}
  
initializeMapAndLocator()






// function positionChangedStart(position) {

//   let coords = position.coords;
//   if(navigator.geolocation){
//     map.setView([coords.latitude,coords.longitude], 13);
//     marker = L.circle([coords.latitude,coords.longitude], {radius:1000})
//     marker.id = name
//     marker.addTo(map);
//   }
//   else {
//     alert("Sorry, browser does not support geolocation!");
//   }
  

  // if (marker.id == name){
  //   marker.setLatLng([coords.latitude,coords.longitude])
  // }
  // else{
  //   map.setView([coords.latitude,coords.longitude], 13);
  //   marker = L.circle([coords.latitude,coords.longitude], {radius:1000})
  //   marker.id = name
  //   marker.addTo(map);

  // }
  // map = L.map('map').setView([coords.latitude,coords.longitude], 13)
  
  // markers[name] = L.marker([coords.latitude,coords.longitude], {title: name}).addTo(map);
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);
  // marker[name]._icon.id = name;
  // marker.setLatLng([coords.latitude,coords.longitude])
  // L.marker([coords.latitude,coords.longitude]).addTo(map);


  // channel.push(("move"), {
  //   name: name,
  //   coords: {
  //     latitude: coords.latitude,
  //     longitude: coords.longitude
  //   }
  // })
// }


// function positionChanged(position) {
//   let coords = position.coords;

//   channel.push(("move"), {
//     name: name,
//     coords: {
//       latitude: coords.latitude,
//       longitude: coords.longitude
//     }
//   })
//   // map = L.map('map').setView([coords.latitude,coords.longitude], 13)
//   // marker[name]._icon.id = name;
//   // marker.setLatLng([coords.latitude,coords.longitude])
//   // L.marker([coords.latitude,coords.longitude]).addTo(map);
// }


// map = L.map('map')
//   // map.setView([coords.latitude,coords.longitude], 13)

//   // marker = L.circle([51.505, -0.09], {radius:1000})
//   // marker.id = name
//   // marker.addTo(map);

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   }).addTo(map);
//   // L.marker([coordsStart.latitude,coordsStart.longitude]).addTo(map);
// // window.initMap = function() {
// //   map = new google.maps.Map(document.getElementById('map'), {
// //     center: {lat: -34.397, lng: 150.644},
// //     zoom: 8
// //   });
// // }

// // markers[name] = L.marker([51.505, -0.09], {title: name}).addTo(map);

// // window.initMap = function() {
// //   map = L.map('map').setView([51.505, -0.09], 13)
// // }

// // map = L.map('map').setView([51.505, -0.09], 13)

// // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // }).addTo(map);
// // marker = L.marker([51.5, -0.09]).addTo(map);

// channel.join()
//   .receive("ok", resp => {

//     // GeolocationPosition.coords(positionChangedStart)
//     navigator.geolocation.watchPosition(positionChangedStart);
//     // navigator.geolocation.watchPosition(positionChangedStart);

//     // console.log(`Moved ${resp.name} to ${resp.coords.latitude}, ${resp.coords.longitude}`, resp.coords);
//     // map.setView([coords.latitude,coords.longitude], 13);
//     // marker = L.circle([coords.latitude,coords.longitude], {radius:1000})
//     // marker.id = name
//     // marker.addTo(map);
    
    
    
//     console.log("Joined successfully", resp)
//   })
//   .receive("error", resp => { console.log("Unable to join", resp) })

// channel.on("welcome", resp => {
//   console.log(`Welcome! Folks we know about: ${resp.names.join(', ')}`)
// })

// channel.on("joined", resp => {
//   console.log(`${resp.names.join(', ')} has joined`)
// })

// // channel.on("left", resp => {
// //   // L.marker([resp.coords.latitude,resp.coords.longitude]).remove(map);
// //   console.log(`${resp.names.join(', ')} has left`)
// // })

// channel.on("moved", resp => {
//   navigator.geolocation.watchPosition(positionChanged);
//   console.log(marker.id)
//   // if (marker.id == resp.name){
//   //   marker.setLatLng([resp.coords.latitude,resp.coords.longitude])
//   // }
//   console.log(resp.name)
//   console.log(`Moved ${resp.name} to ${resp.coords.latitude}, ${resp.coords.longitude}`, resp.coords);
// })

export default socket
