var server = require('http').createServer(handler),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    pwd  = process.cwd();

server.listen(3000);

function handler(req, res){
    
    fs.readFile(pwd + '/index.html',
    function(err,data){
        if(err){
            res.writeHead(500);
            res.end('500 error');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function(socket){
    socket.emit('news', {hello: 'world'});
    socket.on('something else', function(data){
        var command = data.data;
        console.log(command);
    });
});
