
function rellenarDatos(user){
	console.log(user);

	$("#LV").text("LV : " + user.lv);
	$("#HP").text("HP : " + user.hp);
	$("#XP").text("XP : " + user.xp);


	$("#personaje").attr("src", "./img/" + user.tipo + ".png");
}


$( function(){ 

	var idUser = localStorage["idUsuario"]

	//var idUser = 1;

	$.get( "http://maugavilan.com/apps/api/index.php/user/"+idUser, function( data ) {
  		
  		if (data.error == false){
	  		console.log("");
	  		console.log(data.data);

	  		var usuarios = JSON.parse(data.data);

	  		rellenarDatos(usuarios);

	  		console.log(usuarios);
	  	}else{
	  		console.log("ERROR ::: get usuario from api");
	  	}
  		
	});

});