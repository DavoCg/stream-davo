var http = require('http');
var BinaryServer = require('binaryjs').BinaryServer;
var express = require('express');
var _ = require('lodash');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/test', function(res, res){
    return res.json({test: 'OK'})
});

var server = http.createServer(app);

var bs = BinaryServer({server: server});

bs.on('connection', function(client){
    client.on('stream', function(stream, meta){

        console.log('meta', meta);

        var clients = _.values(bs.clients);
        var otherClients = clients.filter(function(cl){return client !== cl});

        console.log('clients :', clients);
        console.log('otherClients :', otherClients);
        

        _.each(otherClients, function(other){
            var responseStream = other.createStream(meta);
            stream.pipe(responseStream);
        });
    });
});

server.listen(9000, function(){
    console.log('server listen port 9000');
});
