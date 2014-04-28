#!/usr/bin/env node
var http = require('http'),
    gm = require('gm'),
    ArgumentParser = require('argparse').ArgumentParser;

parser = new ArgumentParser({
    version: '0.0.0',
    addHelp: true,
    description: 'Accelerometer Header Generator'
});

parser.addArgument(['-i'], {help: 'The issue of accelerometer.'});
parser.addArgument(['-vol'], {help: 'The volume of accelerometer.'});

var options = parser.parseArgs();

function percentize(v) {
    return v / 255 * 100;
}

function buildImage(data) {
    gm('images/base.png')
        .modulate(100, 0, 100)
        //.modulate(data.hsv.hue, data.hsv.saturation, data.hsv.value)
        .colorize(percentize(data.rgb.red), percentize(data.rgb.green), percentize(data.rgb.blue))
        .fill(data.hsv.value > 50 ? '#ffffff' : '#000000')
        .font('Arial.ttf', 28)
        .drawText(270, 40, 'Accelerometer', 'northeast')
        .fontSize(12)
        .drawText(270, 50, 'volume ' + options.vol + ', issue ' + options.i, 'northeast')
        .write('images/accelerometer-v' + parseInt(options.vol, 10) + '-i' + parseInt(options.i, 10) + '.png', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('written with color ' + data.title);
            }
        });
}


http.get('http://www.colourlovers.com/api/colors/random?format=json', function (response) {
    var data = '';
    response.on('data', function (chunk) {
        data += chunk;
    })
    .on('end', function () {
        buildImage(JSON.parse(data)[0]);
    });
});