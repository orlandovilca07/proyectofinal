var WebSocketServer = require("ws").Server
var http = require("http")
const mongodb = require('mongodb')
var express = require("express")
var app = express()
var port = process.env.PORT || 3001


app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
	let uri = 'mongodb://heroku_99dkk2x6:hp4p8uavuekgus0cpk5b5epdu@ds229771.mlab.com:29771/heroku_99dkk2x6';
  	console.log("websocket connection open")

  	//INICIO WEBSOCKET DESCONECTADO
  	ws.on("close", function() {
    	console.log("websocket connection close");
  	})
  	//FIN WEBSOCKET DESCONECTADO

  	//INICIO RECIBIR MENSAJE POR WEBSOCKET
  	ws.on("message",function(mes){
  		var mensaje = JSON.parse(mes);

  		//CONECTADO A MONGODB
  		mongodb.MongoClient.connect(uri, function(err, client) {
			if(err) {
				console.log(err);
			}else{
				console.log('conectado a mongodb registro');
				let db = client.db('heroku_99dkk2x6');
				let clima = db.collection('neurosky');
				if(mensaje.tipo=='report'){
					
				}else{
					//INICIO FECHA
					var hoy = new Date();
				    var dd = hoy.getDate();
				    var mm = hoy.getMonth()+1; //hoy es 0!
				    var yyyy = hoy.getFullYear();
				    var cad = hoy.getHours()+":"+hoy.getMinutes()+":"+hoy.getSeconds(); 
				    if(dd<10) {
				        dd='0'+dd
				    } 
				    if(mm<10) {
				        mm='0'+mm
				    } 
				    //FIN FECHA

				    //INICIO INSERTAR DATO 
					var dataNeurosky = "{\"fecha\":\""+dd+'/'+mm+'/'+yyyy+' '+cad+"\",\"dato\":\""+mensaje.dato+"\"}"
					console.log(mensaje.dato);

					/*clima.insert(JSON.parse(dataNeurosky), function(err, result) {
						if(err){
							console.log(err);
						}else{
							console.log('registrado');
						}
					});*/
					//FIN INSERTAR DATO 
				}
			}
			client.close(function (err) {
	            if(err) {
	              	console.log(err);
	            }else{
	            	console.log('desconectado de mongodb');
	            }
            });
			
		});
		//DESCONECTADO DE MONGODB
  	})
  	//FIN RECIBIR MENSAJE POR WEBSOCKET

})