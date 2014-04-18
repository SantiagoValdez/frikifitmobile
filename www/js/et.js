
var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects

function gps_distance(lat1, lon1, lat2, lon2)
{
  // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);
 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
     
    return d;
}



function getHtmlForOponent(oponent){

  	var name = oponent.nombre;
  	var image = oponent.pic;

  	var c = "";

  	c = "";

}


function calcularPuntos(t){

  var data = t.data;

  total_km = 0;
   
  for(i = 0; i < data.length; i++){
       
      if(i == (data.length - 1)){
          break;
      }
       
      total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
  }
   
  var kms = 0 + (total_km.toFixed(2));

  //Vida 50 HP por KM
  var hps = 0 + (50 * Number(kms).toFixed(0));

  //Experiencia 1 XP por KM
  var xps = 0 + (25 * Number(kms).toFixed(0));

   var id = localStorage["idUsuario"]

  //var id = 1;

  console.log(kms);
  console.log(hps);
  console.log(xps);

  

  $.get( "http://maugavilan.com/apps/api/index.php/user/"+id+"/"+xps+"/"+hps, function( data ) {
      
      if (data.error == false){
        console.log("");
        console.log(data.msg);

        $("#resumen").modal('show');
        

        $("#km").text(kms);
        $("#xp").text(xps);
        $("#hp").text(hps);
      }else{
        console.log("ERROR ::: get usuarios api");
      }
      
  });
  


}


$(function(){


  if(!window.localStorage.getItem('tracks')){
    var tracks = [];
    window.localStorage.setItem('tracks', JSON.stringify(tracks));
  }

  console.log("troloaskdlj");
  if(!navigator.onLine){
    // $("#home_network_button").text('No Internet Access')
    //              .attr("data-icon", "delete")
    //              .button('refresh');
    alert("No tiene acceso a interwebz");
  }else{
  	$("#home_network_button").text('Tenes interweb :D');
  }


  // Establecemos la fecha de hoy como nombre por default
  var d = new Date()

  $("#track_id").val(d.toDateString());







  /*

  Empezar una rutina

  */ 
  $("#startTracking_start").on('click', function(){
    
    console.log("Dentro de startTracking_start"); 
    console.log(tracking_data);
    // Start tracking the User

    navigator.geolocation.getCurrentPosition(function(position) {
      tracking_data.push(position);
      console.log("Inicial...")
      console.log(tracking_data);
      
    }, function(error) {
      console.log("Error occurred. Error code: " + error.code);
      // error.code can be:
      //   0: unknown error
      //   1: permission denied
      //   2: position unavailable (error response from locaton provider)
      //   3: timed out
    });

    watch_id = navigator.geolocation.watchPosition(
     
        // Success
        function(position){
            console.log("Watch pos...");
            tracking_data.push(position);
            console.log(tracking_data);

            $("#puntos").append("<br>->" + tracking_data.length);

        },
         
        // Error
        function(error){
            console.log(error);
        },
         
        // Settings
        { frequency: 1000, enableHighAccuracy: false });
     
    // Tidy up the UI
    track_id = $("#track_id").val();
     
    $("#track_id").hide();
     
    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
  });


  /*
  Encargado de detener el ejercicio

  */

  $("#startTracking_stop").on('click', function(){
   
  console.log("Dentro de startTracking_stop"); 
  console.log(tracking_data);
  // Stop tracking the user
  navigator.geolocation.clearWatch(watch_id);
   
  var tracks = JSON.parse(window.localStorage.getItem('tracks'));
  // Save the tracking data
     
  if(!tracks){
    console.log("no hay tracks...")
    tracks = [];
  }

  console.log("pusheamos " + track_id);
  
  var t = {
            'id' : track_id,
            'data' : tracking_data,
          }

  calcularPuntos(t);

  tracks.push(t);

  window.localStorage.setItem('tracks', JSON.stringify(tracks));

  // Reset watch_id and tracking_data 
  watch_id = null;
  tracking_data = [];

  // Tidy up the UI
  $("#track_id").val("").show();
   
  $("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");

  });

  /*
  limpiar historial
  */
  $("#home_clearstorage_button").on('click', function(){
    window.localStorage.clear();
  });


  /*
  limpiar gps
  */
  $("#home_seedgps_button").on('click', function(){
    window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');

  });





  $('#battle').on('pageshow', function () {

    var oponents = [
    			{nombre:"fulano", level : 5, pic : ""},
    			{nombre:"fulano", level : 5, pic : ""},
    			{nombre:"fulano", level : 5, pic : ""}
    			]; 

    // Empty the list of recorded tracks
    $("#oponent_list").empty();
     
    // Iterate over all of the recorded tracks, populating the list
    for(i=0; i<oponents.length; i++){
      
    	var key = window.localStorage.key(i);
    	var nombre = "workout-" + i;

     	var html = getHtmlForOponent( oponents[i] );

      $("#oponent_list").append(html);
    	
    	
      console.log("Key " + key + " agregando atributo" );

     $("#" + nombre).click(function(){
    		var clave = $(this).text()

    		console.log(clave);

    		$("#track_info").attr("track_id", clave);

     });
    }
  });




///------FUUUUUUUUUUU -----
});




