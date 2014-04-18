

var pusher =  null;
var puller = null;

function consultarSolicitud(){
	var myId = localStorage["idUsuario"];

	$.get( "http://maugavilan.com/apps/api/index.php/battle/check/"+myId, function( data ) {
	  
	  if (data.error == false){
	    

	    console.log("");
        console.log(JSON.parse(data.data));



        batalla = JSON.parse(data.data)[0];
        
        if(batalla){

        	window.clearInterval(puller);

        	alert("Sera dirigido a la batalla");

        	goBatalla(batalla.id);	
	    }

	  }else{
	    console.log("ERROR ::: get usuarios api");
	  }
	  
	});

}

function rechazarBatalla(id){

	$.get( "http://maugavilan.com/apps/api/index.php/battle/deny/"+id, function( data ) {
	  
	  if (data.error == false){
	    
	    console.log("a la mierda la batalla!!!");
	    
	    $("#aceptar-modal").modal('hide');

	    pusher = setInterval(consultarBatalla,1000);

	  }else{
	    console.log("ERROR ::: get usuarios api");
	  }
	  
	});

}

function goBatalla(id){



	$.get( "http://maugavilan.com/apps/api/index.php/battle/ready/"+id, function( data ) {
	  
	  if (data.error == false){
	    
	    console.log("vamos a la batalllaaaa!!!");
	    
	    localStorage["batalla"] = id;
		window.location.href = './arena.html';

	  }else{
	    console.log("ERROR ::: get usuarios api");
	  }
	  
	});


}


function consultarBatalla(){

	var myId = localStorage["idUsuario"];
	//var myId = 1;

	 $.get( "http://maugavilan.com/apps/api/index.php/battle/user/"+myId, function( data ) {
      
      if (data.error == false ){
        
        console.log("");
        console.log(JSON.parse(data.data));



        batalla = JSON.parse(data.data)[0];
        
        if(batalla){
        	window.clearInterval(pusher);
	        console.log(batalla);

	        $("#nombre-retador").empty().append(batalla.user);

	        $("#pie-solicitud").empty().append(''
	        	+'<button type="button" class="btn btn-default" onClick="goBatalla(' + batalla.id + ');">GO!</button>'
	        	+'<button type="button" class="btn btn-default" onClick="rechazarBatalla('+ batalla.id +')">Close</button>');


	        $("#aceptar-modal").modal('show');
	    }


      }else{
        console.log("ERROR ::: get usuarios api");
      }
      
  });

}


function pedirBatalla(id){

	var myId = localStorage["idUsuario"];
	//var myId = 1;

	 $.get( "http://maugavilan.com/apps/api/index.php/battle/new/"+myId+"/"+id, function( data ) {
      
      if (data.error == false){
        console.log("");
        console.log(data.msg);

        $("#envio-modal").modal('show');
        
      }else{
        console.log("ERROR ::: set new batalla api");
      }
      
  });
}


function rellenarListaUsuarios(users){
	for(i=0; i<users.length; i++){
      
      var u = users[i];
      var id = u.id;

      $("#usuarios").append("<a class='btn btn-default btn-history' id='"+id+"'>" + u.user + "</a>");
      
      
      console.log("Key " + id + " agregando atributo" );

	    $("#" + id).click(function(){
	    	console.log( "Click en user ID "+ $(this).attr('id'));

	    	pedirBatalla($(this).attr('id'));
	    	
	    });
	}
}


$( function(){ 

	$.get( "http://maugavilan.com/apps/api/index.php/users", function( data ) {
  		
  		if (data.error == false){
	  		console.log("");
	  		console.log(data.data);

	  		var usuarios = JSON.parse(data.data);

	  		rellenarListaUsuarios(usuarios);

	  		console.log(usuarios);
	  	}else{
	  		console.log("ERROR ::: get usuarios api");
	  	}
  		
	});


	pusher = setInterval(consultarBatalla,1000);
	puller = setInterval(consultarSolicitud,1000);
});