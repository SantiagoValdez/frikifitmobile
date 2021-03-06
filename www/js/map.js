  // When the user views the Track Info page
$( function(){

  // Find the track_id of the workout they are viewing
  var track = JSON.parse(localStorage["track_actual"]);

  console.log(track);

  console.log("mostrar info La clave es " + track.id);


  // Update the Track Info page header to the track_id
  $("#track_info").text("<h1>"+track.id+"</h1>");

  // Get all the GPS data for the specific workout
  var data = track.data;

  // Turn the stringified GPS data back into a JS object
  //data = JSON.parse(data);

  // Calculate the total distance travelled
  total_km = 0;
   
  for(i = 0; i < data.length; i++){
       
      if(i == (data.length - 1)){
          break;
      }
       
      total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
  }
   
  total_km_rounded = total_km.toFixed(2);

  // Calculate the total time taken for the track
  start_time = new Date(data[0].timestamp).getTime();
  end_time = new Date(data[data.length-1].timestamp).getTime();

  total_time_ms = end_time - start_time;
  total_time_s = total_time_ms / 1000;

  final_time_m = Math.floor(total_time_s / 1000);
  final_time_s = total_time_s - (final_time_m * 60);

  // Display total distance and time
  $("#track_info_info").html('Travelled <strong>' + total_km_rounded + 
  	'</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + 
  	final_time_s + 's</strong>');



  // ____ MAPA ____

  // Set the initial Lat and Long of the Google Map
  var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);
   
  // Google Map options
  var myOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
   
  // Create the Google Map, set options
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  var trackCoords = [];

  // Add each GPS entry to an array
  for(i=0; i<data.length; i++){
      trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
  }



  // Insert a marker... this is the marker of Ster Piskore
  var markerInicio = new google.maps.Marker({
      position: new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude),
      map: map,
      title: 'Inicio!'
  	});

  var markerFin = new google.maps.Marker({
      position: new google.maps.LatLng(data[data.length-1].coords.latitude, data[data.length-1].coords.longitude),
      map: map,
      title: 'Fin!'
  	});


  // Plot the GPS entries as a line on the Google Map
  var trackPath = new google.maps.Polyline({
    path: trackCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
   
  // Apply the line to the map
  trackPath.setMap(map);
  });
