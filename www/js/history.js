  // When the user views the history page
  $(function () {

if(window.localStorage['tracks']){

    var tracks_list =  JSON.parse(window.localStorage['tracks']);
    // Count the number of entries in localStorage and display this information to the user
    tracks_recorded = tracks_list.length;
    $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");
     
    // Empty the list of recorded tracks
    $("#history_tracklist").empty();
    
    
    // Iterate over all of the recorded tracks, populating the list
    for(i=0; i<tracks_recorded; i++){
      
      var t = tracks_list[i];
      var nombre = "workout-" + i;
      $("#history_tracklist").append("<a href='#track_info' class='btn btn-default btn-history' id='"+nombre+"'>" + t.id + "</a>");
      
      
      console.log("Key " + t.id + " agregando atributo" );

    $("#" + nombre).click(function(){

      var clave = $(this).text();
      console.log("Click en " + clave );
      var list =  JSON.parse(window.localStorage['tracks']);
      var t = null;

      for(i=0;i<list.length;i++){
        if(list[i].id == clave){
          t = list[i];
        }
      }


      console.log(t);

      if(t){
        localStorage.setItem("track_actual", JSON.stringify(t));
        window.location.href = './map.html';
      }
    });
    
    }
}     
    
  });