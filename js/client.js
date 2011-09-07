/*******************************************************************************
 * 
 * Streaming Video Client
 * 
 *******************************************************************************
 */

var ws = new WebSocket("ws://192.168.1.2:8001/"),
img = document.getElementById('img');

//setup callbacks
ws.onopen = function() 
{
    console.log('Websocket Open');
};

ws.onclose = function() 
{
    console.log('Websocket Closed');
};

ws.onerror = function(event) 
{
    console.log('error');
};

ws.onmessage = function(message)
{   
    img.src=message.data;
};

