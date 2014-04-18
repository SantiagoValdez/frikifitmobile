var pusher = null;
var battle = null;
var p1 = null;
var p2 = null;
//comprobar que player somos...
var player = 0;
var p = null;
var op = null;
var flagImagen = false;
var flagPrimeraVez = false;



function testBarra(){

	$("#enemy-hp").width("50%");

}

function animarAtaque(l){
	
	if(l == 0){
		$("#enemy-attack").show();
		setTimeout(function(){
			console.log("chau enemigos...");
			$("#enemy-attack").hide();
		}, 1500);
	}else{

		if(flagPrimeraVez == false){
			flagPrimeraVez = true;
		}else{
			$("#my-attack").show();
			setTimeout(function(){
				console.log("aina...");
				$("#my-attack").hide();
			}, 1500);
		}
	}

}



function animarBarra(){
	
	
	

	$("#my-hp").width(p.hp + "%");
	$("#enemy-hp").width(op.hp + "%");

}

function cambiarTurno(){
	if(battle.turno == 1){
		battle.turno = 2;
	}else{
		battle.turno = 1;
	}
}
function attack(){
	console.log("En attack...")
	cambiarTurno();
	battle.intensidad = 20 ;

	

	if(player == 1){
		p2.hp = p2.hp - 20 ;

	}else{
		p1.hp = p1.hp - 20 ;
	}
	op.hp = op.hp - 20;

	animarAtaque(0);
	animarBarra();

	console.log(battle);

	update();

}

function run(){

}

function item(){

}

function win(){
	//MUESTRA EL MENSAJE QUE GANO
	console.log("GANADOR!!!!");

	$("#resultado-titulo").text("Congratulations! You WON!");
	$("#resultado-mensaje").text("Your sportian is stronger than " + op.user +"'s" );

	$("#modal-resultado").modal("show");
}

function lose(){
	// MUESTRA EL MENSAJE DE QUE PERDIO
	console.log("PERDEDOR");


	$("#resultado-titulo").text("Ohhh :(");
	$("#resultado-mensaje").text("You lose, but don't worry, just take a walk and prepare for the next battle" );

	$("#modal-resultado").modal("show");

}

function setPerdedor(p){

	var ganador = 0;

	if(p1.id == p.id){
		p1.hp = 0;
		ganador = 2;
	}else{
		p2.hp = 0;
		ganador = 1;
	}

	battle.ganador = ganador;

	console.log("Ganador" + ganador);

	update();

}

function calcularDamage(b,p){

	console.log(b);

	animarAtaque(1);
	animarBarra();
	
	//Critico
	if( p.hp <= 0 ){
		setPerdedor(p);
	}

}

function deshabilitarBotones(){
	$("#attack-btn").hide();
}


function habilitarBotones(){
	$("#attack-btn").show();
}

function juego(){

	var myId = localStorage["idUsuario"];

	console.log("Mi id" + myId);


	if(p1.id == myId){
		console.log("p1 : " + p1.id);
		player = 1;
		p = p1;
		op = p2;
		$("#oponent-name").empty().append(p2.user);
	}else{
		console.log("p2 : " + p2.id);
		player = 2;
		p = p2;
		op = p1;
		$("#oponent-name").empty().append(p1.user);
	}
	cargarImagenes();
	animarBarra();

	//hay ganador
	if(battle.ganador != 0){
		//GANO!
		if(battle.ganador == player){
			win();
			return;
		}else{
			lose();
			return;
		}
	}else{
		//Comprobar si nos corresponde el turno...
		if(battle.turno == player){

			console.log("MI TURNO !!!!");

			calcularDamage(battle,p);
			habilitarBotones();
		}else{
			//Stand by
			deshabilitarBotones();
		}
	}


}

function update(){

	if(battle.ganador != 0){
		battle.estado = 2;
	}

	var datos = {
		'b' : battle,
		'p1' : p1,
		'p2' : p2,
	}

	console.log("MANDO...");
	console.log(datos);
	$.post("http://maugavilan.com/apps/api/index.php/battle/update", datos );

}

function getUpdate(){

	var id = localStorage["batalla"];

	$.get( "http://maugavilan.com/apps/api/index.php/battle/"+id, function( data ) {
		  
	  if (data.error == false){
	    
	    var b = JSON.parse(data.data);
	    


	    battle = b.battle;
	    p1 = b.p1;
	    p2 = b.p2;

	    

	    var timestamp = JSON.parse(localStorage["timestamp"]);
	    if ( timestamp == null || timestamp != battle.time ){
	    	timestamp = battle.time;
	    	localStorage["timestamp"] = JSON.stringify(timestamp);
	    	
	    	console.log(b);
	    	// console.log(battle);
	    	// console.log(p1);
	    	// console.log(p2);


	    	juego(battle,p1,p2);


	    }

	  }else{
	    console.log("ERROR ::: get usuarios api");
	  }
	  
	});

}

function cargarImagenes(){

	if( !flagImagen ){
		$("#enemy-sprite-still").attr("src", "./img/f-" + op.tipo + ".png");

		$("#my-sprite-still").attr("src", "./img/b-" + p.tipo + ".png");

		flagImagen = true;
	}
}

$( function(){
	localStorage["timestamp"] = JSON.stringify(null);
	pusher = setInterval(getUpdate,1000);

	
	//getUpdate();
});