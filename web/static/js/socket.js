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
  
}
  
initializeMapAndLocator()


export default socket
