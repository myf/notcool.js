var server = require('http').createServer(handler),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    pwd  = process.cwd(),
    port = 3000,
    exec = require('child_process').exec;

server.listen(port);

function handler(req, res){
    var filename = 'index.html';
    if (req.url === '/term.js') {
        filename = 'term.js';
    } else if (req.url==='/maze.js'){
        filename = 'maze.js';
        
    }

    
    fs.readFile(pwd + '/' + filename,
        function (err,data) {
            if (err){
                res.writeHead(500);
                res.end('500 error');
                return;
            }
            res.writeHead(200);
            res.end(data);
    });
}
//getting output from a command issued

io.sockets.on('connection', function(socket) {
    //socket.emit('news', {hello: 'world'});
    socket.on('request', function(data) {
        exec(data, function (error, stdout, stderr) {
            var output = stdout;
            var output = stdout.match(/^.*([]+|$)/gm);
            console.log(output.length);
            socket.emit('response',output);
        });
    });
});
