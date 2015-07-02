var BinaryServer = require('binaryjs').BinaryServer;
var server = BinaryServer({port: 9000});
var fs = require('fs');
var _ = require('lodash');

server.on('connection', function(client){
    client.on('stream', function(stream, meta){

        var clients = _.values(server.clients);
        var otherClients = clients.filter(function(cl){return client !== cl});

        _.each(otherClients, function(other){
            var responseStream = other.createStream(meta);
            stream.pipe(responseStream);
        });

    });
});
