var express = require('express');
var path = require('path');
var request = require('request');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const morgan = require('morgan');

var app = express();

app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));
app.use(express.static('public'));
app.use(morgan('combined'))


app.get('/name', function (req, res) {

    console.log("ah bhai chalyo hw chalyo ");

    res.send("Angel");

});

app.get('/playback', function (req, res) {
    console.log("hitttt")
    //the request module is piping the steam over the get request coming on playback.mp3
    request.get('http://localhost:8000/music/music.m4a').pipe(res, function (error) {
        console.log(error);
    });
});

app.get('/musics', (req, res) => {
    fs.readdir('public/music', (err, files) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            res.json(files);
        }
    })
})

app.post('/upload', function (req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    file = req.files.music;
    console.log(file)
    // Use the mv() method to place the file somewhere on your server
    // req.files.music.mv('public/music/' + req.files.name, function (err) {
    //     if (err)
    //         return res.status(500).send(err);

    //     res.writeHead(301,
    //         { Location: 'index.html' }
    //     ).send();

    // });


    let filename = Date.now() + '-' + file.name;
    fs.writeFile('public/music/' + filename, file.data, (err) => {
        if (err) {
            if (err)
                return res.status(500).send(err);
        }
        res.writeHead(301,
            { Location: 'index.html' }
        ).send();

    });


});


//here the server is localhost and listening on the port 8000
app.listen(8000, function () {
    console.log("Listening on 8000");
});