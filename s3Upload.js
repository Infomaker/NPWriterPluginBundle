var fs = require('fs')
var aws = require('aws-sdk')

var fileStreamJs = fs.createReadStream('dist/index.js');
var fileStreamStyle = fs.createReadStream('dist/style.css');

fileStreamJs.on('error', function (err) {
    if (err) { throw err; }
})
fileStreamStyle.on('error', function (err) {
    if (err) { throw err; }
})

var s3 = new aws.S3();

fileStreamJs.on('open', () => {
    s3.putObject({
        Bucket: 'writer-dev-plugins',
        Key: 'index.js',
        Body: fileStreamJs
    }, function (err) {
        if (err) { throw err; }
    });

})

fileStreamStyle.on('open', () => {
    s3.putObject({
        Bucket: 'writer-dev-plugins',
        Key: 'style.css',
        Body: fileStreamStyle,
        ContentType: 'text/css'
    }, function (err) {
        if (err) { throw err; }
    });
})