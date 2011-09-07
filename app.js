var http = require('http');
var fs = require('fs');
var ws = require('websocket-server');
var sys = require("sys");
var path = require('path');

//create websocket server
var ws_server = ws.createServer();

/**
 * Setup simple http server to serve static page elements on port 8000
 */
http.createServer(function (request, response) {

    console.log('request starting...');
	
	var filePath = '.' + request.url;
	if (filePath == './')
		filePath = './index.html';
		
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
	
	path.exists(filePath, function(exists) {
	
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});
	
}).listen(8000);



// Handle WebSocket Requests
ws_server.addListener("connection", function(conn){

//add listener to rebroadcast incomming messages
  conn.addListener("message", function(msg){
	console.log('message');
        conn.broadcast(msg);
    });
});

ws_server.addListener("error", function(){
  console.log(Array.prototype.join.call(arguments, ", "));
});


ws_server.addListener("disconnected", function(conn){
  ws_server.broadcast("<"+conn.id+"> disconnected");
});

//start websocket server on port 8001
ws_server.listen(8001);
