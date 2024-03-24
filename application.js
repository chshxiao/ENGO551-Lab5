
document.addEventListener('DOMContentLoaded', function() {

  // create the map
  let map = L.map('map').setView([51.02, -114.05], 11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // create the mqtt connection
  var mqtt;
  var reconnectTimeout = 2000;
  var connected_flag = 0;
  var host="broker.emqx.io";
  var port=8083;
  var topic = "engo551/chunsheng_xiao/my_temperature";

  // called when the client connects
  function onConnect() {
    connected_flag = 1;
    console.log("connected to " + host + " on port " + port);

    mqtt.subscribe(topic);
    console.log("subscribe to the topic = " + topic);
  }

  // called when the failure comes, reconnect automatically
  function onFailure() {
    console.log("Failed");
    setTimeout(MQTTconnect, reconnectTimeout);
  }

  // called when the connection is losted
  function onConnectionLost() {
    alert("connection lost");
    connected_flag = 0;
  }

  // called when a message arrives
  function onMessageArrived(message) {
    // received GeoJSON message
    msg = JSON.parse(message.payloadString);
    console.log(msg);

    // create a marker on the location
    var lat = msg["geometry"]["coordinate"][0];
    var lon = msg["geometry"]["coordinate"][1];
    var temp = msg["properties"]["temperature"];
    
    // blue if less than 10 deg
    // green if between 10 to 30 deg
    // red if above 30 deg
    var my_icon;

    if(temp < 10) {
      my_icon = L.icon({
        iconUrl: 'img/marker-icon-2x-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    } else if (temp < 30) {
      my_icon = L.icon({
        iconUrl: 'img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    } else {
      my_icon = L.icon({
        iconUrl: 'img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }

    var marker = new L.marker([lat, lon], {icon: my_icon}).addTo(map);

    marker.bindPopup(`temperature: ${temp} C`);

  }

  function MQTTconnect() {
    var x = Math.floor(Math.random() * 10000);
    var cname = "orderform-" + x;

    mqtt = new Paho.MQTT.Client(host, port, cname);

    var options = {
      timeout: 3,
      onSuccess: onConnect,
      onFailure: onFailure,
    };

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    mqtt.connect(options);
    return false;
  }



  // connect to the websocket
  MQTTconnect();


  // // set the height of the map
  // $(window).on("resize", function() {
  //   $("#map").height($(window).height());
  //   map.invalidateSize();
  // }).trigger("resize");


  // // create a variable for marker cluster
  // var markers = L.markerClusterGroup();


  // // get the earliest date
  // fetch('https://data.calgary.ca/resource/c2es-76ed.json?$select=min(issueddate)')
  // .then(response => response.json())
  // .then(data => {
    
  //   let earliest = data[0]['min_issueddate'];
  //   let year = earliest.substring(0, 4);
  //   let month = earliest.substring(5, 7);
  //   let day = earliest.substring(8, 10);
  //   let earliest_date_format = month + '/' + day + '/' + year;


  //   // set up the date range picker
  //   let datepicker = $('input[name="daterange"]').daterangepicker({
  //     startDate: earliest_date_format,
  //     showDropdowns: true
  //   }, function(start, end) {

  //     let start_date = start.format('YYYY-MM-DD');
  //     let end_date = end.format('YYYY-MM-DD');

  //     let url = `https://data.calgary.ca/resource/c2es-76ed.json?$where=issueddate>='${start_date}' AND issueddate<='${end_date}'`;
  //     fetch(url)
  //     .then(response => response.json())
  //     .then(data => {

  //       console.log(data);

  //       data.forEach(dat => {
  //         markers.addLayer(
  //           L.marker([Number(dat['latitude']), Number(dat['longitude'])])
  //             .bindPopup(() => {

  //               let permitNum = dat['permitnum'];
  //               let issuedDate = dat['issueddate'];
  //               let workclassGroup = dat['workclassgroup'];
  //               let communityName = dat['communityname'];
  //               let originalAddress = dat['originaladdress'];
  //               let contractorName = dat['contractorname'] ?? "";

  //               return `Permit Number: ${permitNum}<br>` + 
  //                       `Issued Date: ${issuedDate}<br>`+
  //                       `Workclass Group: ${workclassGroup}<br>` +
  //                       `Contractor Name: ${contractorName}<br>` +
  //                       `Community Name: ${communityName}<br>` +
  //                       `Original Address: ${originalAddress}`;
  //             })
  //         )
  //         map.addLayer(markers);
            
  //       })
  //     });
  //   });


  //   document.querySelector('#refreshButton').onclick = function() {
  //     markers.clearLayers();
  //     map.setView([51.02, -114.05], 11, {
  //       animate: true,
  //       duration: 0.5
  //     });
  //     datepicker.data('daterangepicker').setStartDate(earliest_date_format);
  //     datepicker.data('daterangepicker').setEndDate(moment());
  //   }
  // });

});
