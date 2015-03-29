/* jshint undef: true, node: true */

var express = require('express.io');
var piblaster = require('pi-blaster.js');
var path = require('path');
var app = express();
app.http().io();

var RED_GPIO_PIN = 23;
var GREEN_GPIO_PIN = 18;
var BLUE_GPIO_PIN = 24;
var current='000';


//Serve public content - basically any file in the public folder will be available on the server.
app.use(express.static(path.join(__dirname, 'public')));

//We also need 3 services - Red, Green and Blue.
// Each section is doing exactly the same but for a particular color.
// First, we grab the value and if it is an integer we are dividing it by 255 and sending it to the pi-blaster daemon.

app.get('/red/:value', function (req, res) {
    console.log("red = " + req.params.value);
    var redValue = req.params.value;
    if( !isNaN( parseInt(redValue) ) ){
        piblaster.setPwm(RED_GPIO_PIN, redValue/255);
        res.send('ok');
    } else {
        res.status(400).send('error');
    }
});

app.get('/green/:value', function (req, res) {
    console.log("green = " + req.params.value);
    var greenValue = req.params.value;
    if( !isNaN( parseInt(greenValue) ) ){
        piblaster.setPwm(GREEN_GPIO_PIN, greenValue/255);
        res.send('ok');
    } else {
        res.status(400).send('error');
    }
});

app.get('/current/', function (req, res) {
    console.log("current = " + current);
    res.send(current);
});

app.get('/rgb/:value', function (req, res) {
    console.log("hex = " + req.params.value);
    current=req.params.value;

    var rgbValue = req.params.value;
    if( !isNaN(rgbValue = parseInt(req.params.value, 16) ) ){
        var r = (rgbValue >> 16) & 255;
        var g = (rgbValue >> 8) & 255;
        var b = rgbValue & 255;
    console.log("rgb = " + r + "g:" + g + "b:" + b);
        piblaster.setPwm(GREEN_GPIO_PIN, g/255);
        piblaster.setPwm(BLUE_GPIO_PIN, b/255);
        piblaster.setPwm(RED_GPIO_PIN, r/255);
        res.send('ok');
    } else {
        res.status(400).send('error');
    }
});

app.io.route('drawClick', function(req) {
    req.io.broadcast('draw', req.data);
    console.log("io.broadcast " + req.data);
    
    var rgbValue = req.data;
    if( !isNaN(rgbValue = parseInt(req.data, 16) ) ){
        var r = (rgbValue >> 16) & 255;
        var g = (rgbValue >> 8) & 255;
        var b = rgbValue & 255;
    console.log("io rgb = r:" + r + " g:" + g + " b:" + b);
        piblaster.setPwm(GREEN_GPIO_PIN, g/255);
        piblaster.setPwm(BLUE_GPIO_PIN, b/255);
        piblaster.setPwm(RED_GPIO_PIN, r/255);
    };
})

app.io.route('ready', function(req) {
    req.io.emit('talk', {
        message: current
    })
})


// Start listening on port 3000.
var server = app.listen(3100, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('RGB LED Slider listening at http://%s:%s', host, port);
});


