

/*******************************************************************************
 *
 * Camera Functionality
 *
 *******************************************************************************
 */

var videoId = 'video',
scaleFactor = 0.5,
snapshot = null,
upload_image, 
video = document.getElementsByTagName('video')[0], 
heading = document.getElementsByTagName('h1')[0];
var ws = new WebSocket("ws://192.168.1.2:8001/");



/**
 * Captures a image frame from the provided video element.
 * 
 * @param {Video} video HTML5 video element from where the image frame will be captured.
 * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
 * 
 * @return {Canvas}
 */
function capture(video, scaleFactor) {
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return canvas;
}
            
/**
 * Invokes the capture() function and attaches the canvas element to the DOM.
 */
function shoot(){
    var output = document.getElementById('output');
    var canvas = capture(video, scaleFactor);
    canvas.onclick = function(){
        window.open(this.toDataURL());
    };
    
    //load the photo when the new page opens
    $('#photos').live('pageshow',function(){
        $('#output').html(canvas);
        upload_image = canvas.toDataURL();
    });
    
    //load the photos page
    $.mobile.changePage('#photos');

}
    
/**
 * Tests support for toDataURL required for linking to full size images
 * 
 * @return {bool}
 */
    
function supportsToDataURL()
{        
    var c = document.createElement("canvas");
    var data = c.toDataURL("image/png");
    return (data.indexOf("data:image/png") == 0);
}

/**
 * Tests support for getUserMedia... kind of the whole point of this
 * 
 * @return {bool}
 */

function supportsGetUserMedia()
{
    if(!navigator.getUserMedia) 
    {
        heading.textContent = 
        "Native web camera streaming is not supported in this browser!";
        
        return false
    }
    else
    {
        return true;
    }
}

         
if(supportsGetUserMedia()) 
{      
    navigator.getUserMedia('video', successCallback, errorCallback);
                
    function successCallback( stream ) 
    {
        video.src = stream;
    }
                
    function errorCallback( error ) 
    {
        heading.textContent = 
        "An error occurred: [CODE " + error.code + "]";
    }
} 

            
if(!supportsToDataURL())
{
    heading.textContent+="You browser is lame and does NOT support Canvas.toDataURL();"
}


/*******************************************************************************
 * 
 * Websockets stuff
 * 
 *******************************************************************************
 */
button = document.getElementById('button');

//setup websocket connection



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

ws.onmessage = function(event) 
{
    console.log('message');
};

//bind button to send picture
addEventListener('click', streamFrame, false);

/**
 * Start grabbing frames and sending them via the websocket
 * 
 * Called when the button is pressed, grabs a frame of video,
 * renders it to the canvas, grabs the base64 encoded data and
 * sends it through the websocket. The framerate can be adjusted
 * by changing the interval time but I found this to be the fastest
 * my phone could cope with
 * 
 */

function streamFrame()
{
    var context = canvas.getContext("2d");
    
    setInterval(function(){
        context.drawImage(video, 0, 0, 240, 320);
        var image = canvas.toDataURL("image/png");

        
        console.log('send');
        ws.send(image);    

    },400);  
}