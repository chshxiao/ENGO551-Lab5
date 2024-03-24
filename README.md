# ENGO551-Lab5

This project uses mqtt protocol to make connection between cell phones and a leaflet map application. Once they get connected, they will subscribe the same topic. And then the cell phone wil send its location which is derived from geolocation javascript API and a random temperature number to the leaflet application. A marker is created on the location and a popup about the temperature is also enabled.

index.html is the websocket configuration page. Users are able to specify the server and the port in the uppermost section. Once the users click connect, the input field are locked unless they click on disconnect.
Users can subscribe to a topic in the second section. Once it's set up, the publish topic fields below will have a default value of the same topic for convenience.
Users can send message in the third section and send your location and temperature at the fourth section. 
The status message below tells user the status of the system, is it connected? What's the topic subscribed? The received message is triggered when the message is received.

application.html is the map application. The host and port are set to be the same as the demo before. Once the users click on share my status, the information will be sent in GeoJSON format. A marker is created pointing to the location and a popup is created as well to show the temperature input. The color of the marker is interactive and based on the temperature. There are three different groups of temperature, below 10 deg, 10 to 30 deg cel, and above 30 deg cel. The marker is blue, green, or red respectively.
