var server = require('http').createServer(handler),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    pwd  = process.cwd(),
    exec = require('child_process').exec;

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
//getting output from a command issued

/*
function command(com,callback) {
    var html;
    exec(com, function(error, stdout, stderr){
    var child = stdout;
    var raw = child.match(/^.*([]+|$)/gm);
    var len = raw.length;
    var arr = new Array(len);
    for (i=0;i<=len;i++){
        arr[i] = "<br><a href = '"+raw[i] + "'>" + raw[i] +"</a>";
    }
    html = arr.join("\n");
    console.log("this is command "+html);
    callback(html);

    });
};
*/

io.sockets.on('connection', function(socket){
    //socket.emit('news', {hello: 'world'});
    socket.on('enter', function(data){
        exec(data, function (error, stdout, stderr){
        console.log(data.length);
        var output = stdout;
        var output = output.match(/^.*([]+|$)/gm);
        console.log(data);
        console.log(stderr);
        console.log(output);
        });
        //socket.broadcast.emit(output);
    });
});
