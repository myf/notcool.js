function maze() {

    var canvas = document.getElementById("term")
        , context = canvas.getContext("2d")
        , context2 = canvas.getContext("2d")
        , context3 = canvas.getContext("2d")
        , contextWalls = canvas.getContext("2d")
        , ctxArcCover = canvas.getContext("2d")
        , offset = {x:35, y:485} //location of marker
        , offsetA = [35,485];

    //utility that takes a coordinate object and returns the [x,y] canvas array
    var coorToCan = function(coObj) {
      return [(coObj.x - 1) * 50 + 35,485 - ((coObj.y - 1) * 50)];
    };

    var canToCoor = function(canObj) {
        return [(canObj.x + 15) / 50,(535 - canObj.y) / 50];
    };

    var drawGrid = function(context, sideLength, boxLength, offsetI) {
        var xStart = offsetI
            , yStart = offsetI
            , xEnd = xStart + sideLength
            , yEnd = yStart + sideLength
            , xCoord = xStart + boxLength
            , yCoord = yStart + boxLength;

      //draw horizontal lines
      context.moveTo(offsetI,offsetI);
      while (yCoord < yEnd) {
        context.moveTo(xStart, yCoord);
        context.lineTo(xEnd, yCoord);
        context.stroke();
        yCoord += boxLength;
      }
      //draw vertical lines
      context.moveTo(offsetI, offsetI);
      while (xCoord < xEnd) {
        context.moveTo(xCoord, yStart);
        context.lineTo(xCoord, yEnd);
        context.stroke();
        xCoord += boxLength;
      }
    };

    //create object with wall coordinates as keys
    var createWallObject = function(dimensions) {
      var walls = {}
        , start = [1,1];
      //add vertical walls
      for (var y = 1; y <= dimensions[1]; y++) {
        var x = 1.5;
        while(x < dimensions[0]) {
          walls[x+'_'+y] = 1;
          x += 1;
        }
      }
      for (var x = 1; x <= dimensions[0]; x++) {
        var y = 1.5;
        while(y < dimensions[1]) {
          walls[x+'_'+y] = 1;
          y += 1;
        }
      }
    return walls;
    };

    //given two coordinates finds the boundary between them; used with ternary assignment
    var returnWall = function(prev, next) {
            return (prev < next) ? (prev + .5) : (next + .5);
    };
    
    //takes a wallsObject and removes the keys for walls in path
    var removePathWalls = function(wallsObj, pathA) { 
        for (var i = 0; i< pathA.length-1; i++) {
            var prev = pathA[i];
            var next = pathA[i+1];
            //determine what axis the wall is
            var x = prev.x === next.x ? prev.x : returnWall(prev.x, next.x); 
            var y = prev.y === next.y ? prev.y : returnWall(prev.y, next.y);
            var key = x + '_' + y;
            delete wallsObj[key];
        }
        return wallsObj;
    };  

    var removeFPathWalls = function(wallsObj, arrOfFPaths) {
        arrOfFPaths.forEach(function(FPath) {
            removePathWalls(wallsObj, FPath);
        });
    };

    //given a wallsObj draws the wall
    var drawWalls = function(wallObj, wLength, offset) {  
        contextWalls.beginPath();
        contextWalls.strokeStyle = 'red';
        for (key in wallObj) {
            drawWall(key.split('_'), wLength, offset);
        }
    };

    //helper function for wallsObj that actually draws the line
    var drawWall = function(wallArr, wLength, offset) {
        offset = [offset[0] - 25, offset[1] + 25];
        //determine if y-axis wall
        if (wallArr[0].indexOf('.') === -1) {
            contextWalls.moveTo(offset[0] + ((wallArr[0] - 1) * wLength),
                                offset[1] - (parseInt(wallArr[1], 10) * wLength));
            contextWalls.lineTo(offset[0] + (wallArr[0] * wLength),
                                offset[1] - (parseInt(wallArr[1], 10) * wLength));
        }
        else if (wallArr[1].indexOf('.') === -1) {
            contextWalls.moveTo(offset[0] + (parseInt(wallArr[0], 10) * wLength),
                                offset[1] - ((wallArr[1] -1) * wLength));
            contextWalls.lineTo(offset[0] + (parseInt(wallArr[0], 10) * wLength),
                                offset[1] - (wallArr[1] * wLength));
        }
        contextWalls.stroke();
    };

    //draw outline of maze
    var drawBase = function() {
      context.moveTo(10, 10);
      context.lineTo(10, 510);
      context.lineWidth = 1;
      context.stroke();

      context.moveTo(60, 510);
      context.lineTo(510,510);
      context.stroke();

      context.lineTo(510,10);
      context.stroke();

      context.moveTo(460, 10)
      context.lineTo(10,10);
      context.stroke();

      //draw gridlines
      context.beginPath();
      context.strokeStyle = "#B0C4DE";
      drawGrid(context, 500, 50, 10);
    };

    //draw postion marker
    var drawArc = function(offset) {
      context2.beginPath();
      context2.arc(offset.x,offset.y,5,0,2*Math.PI,false);
      context2.fillStyle = "#8ED6FF";
      context2.fill();
      context2.lineWidth = 2;
      context2.strokeStyle = "black";
      context2.stroke();
    };

    drawBase();
    drawArc(offset);

    var coverArc = function(ctx, offsObj) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(offsObj.x - 20, offsObj.y - 20, 40, 40);
    };

    var count = 0;
    var moveArc = function(key, offsObj, func, wallsObj) {
        var current = {x:offsObj.x,y:offsObj.y};
        var next = func.call({x:offsObj.x, y:offsObj.y});
        console.log(next);
        if (validArcMove(canToCoor(current), canToCoor(next), wallsObj)) {     
            coverArc(ctxArcCover, offsObj);
            switch(key) {
                case 37:
                    offsObj.x -= 50;
                    break;
                case 38:
                    offsObj.y -= 50;
                    break;
                case 39:
                    offsObj.x += 50;
                    break;
                case 40:
                    offsObj.y += 50;
                    break;
                case 72:
                    offsObj.x -= 50;
                    break;
                case 75:
                    offsObj.y -= 50;
                    break;
                case 76:
                    offsObj.x += 50;
                    break;
                case 74:
                    offsObj.y += 50;
                    break;
        }
            drawArc(offsObj);
            count += 1;
            $('#count').text(count);
            if (isEnd(canToCoor(next), ending)) {
                alert('You Won, You Deserve A Cookie!!!');
            } 
        }
        return offsObj;
    };
    
    var drawPath = function(path, offset) {
        context3.beginPath();
        context3.moveTo(offset.x, offset.y);
        context3.strokeStyle = "#6699FF";
        context3.lineWidth = 5;
        var curX = offset.x,  curY = offset.y;
        var drawSegment = function(curCoord, nextCoord) {
        if (curCoord.x < nextCoord.x) {
            curX += 50;
            context3.lineTo(curX, curY);
        }
        else if (curCoord.x > nextCoord.x) {
            curX -= 50;
            context3.lineTo(curX, curY);
        }
        else if (curCoord.y < nextCoord.y) {
            curY -= 50;
            context3.lineTo(curX, curY);
        }
        else if (curCoord.y > nextCoord.y) {
            curY += 50;
            context3.lineTo(curX, curY);
        }
            context3.stroke();
        };
        while ( path.length > 1) {
       // function run() {
            drawSegment(path.shift(), path[0]);
       // };
       // setTimeout("run()", 500);
            console.log('drawing x: '+curX+' y: '+curY);
        }
    };

    //base configuration
    var dim = [10,10]
      , starting = {x:1, y:1}
      , ending = {x:10, y:10};

    var isEnd = function(locArr, end) {
        return (locArr[0]=== end.x && locArr[1]=== end.y) ? 1 : 0;
    };

    //check if path finding move is within bounds
    var validMove = function(coordArr, dimensions, visited) {
        var endX = coordArr[0]
          , endY = coordArr[1];
        return ( endX < 1 || endX > dimensions[0] || endY < 1 || endY > dimensions[1] || visited.hasOwnProperty(endX+'_'+endY)) ? 0 : 1;
    };
    
    //check if arc movement is valid, i.e. not crossing a wall
    var validArcMove = function(prevArr,nextArr,wallsObj) {
        var x = prevArr[0] === nextArr[0] ? prevArr[0] : returnWall(prevArr[0], nextArr[0]); 
        var y = prevArr[1] === nextArr[1] ? prevArr[1] : returnWall(prevArr[1], nextArr[1]);
        return ( x < 1 || x > 10 || y < 1 || y > 10 || wallsObj.hasOwnProperty(x+'_'+y)) ? 0 : 1;
    };

    var anyValidPath = function (nArray, end, dimensions, curPath) {
        var checked = {}, toCheck = [], valid = false;
        toCheck.push(nArray);
        //check if start value is the end
        if (isEnd(nArray, end)) {
            return true;
        }
        var checkNs = function(nA) {
            checked[nA[0]+'_'+nA[1]] = 1;
            for ( var i = 0; i < 4; i++) {
                var n = getNeighbor[i](nA); 
                //console.log('checkN: '+n);
               if (isEnd(n, end)) {
                    valid = true;
                    break;
                } 
                else if (validMove(n, dimensions, curPath) && !checked.hasOwnProperty(n[0]+'_'+n[1])) {
                    toCheck.push(n);
                }
            }
            return valid;
        };
        while(toCheck.length > 0) {
            if (checkNs(toCheck.pop())) {
                break;
            }    
        }
        return valid;
    };
    

    var randomMove = function(array) {
        var move = Math.floor(Math.random()*4);
        switch(move) {
            case 0:
                array[0] -= 1;
                break;
            case 1:
                array[0] += 1;
                break;
            case 2:
                array[1] -= 1;
                break;
            case 3:
                array[1] += 1;
                break;
        }
        return array ;  
    };

    var visited = {}; //obj for efficient lookup of nodes in path
    var randomPath = function(current, end) {
        console.log('starting randPath');
        visited['1_1'] = 1; //add starting node to visited object
        var path = []; // list of nodes in path
        path.push(current);
        while (!isEnd([path[path.length-1]['x'],path[path.length-1]['y']], end)) {         
            var next = randomMove([path[path.length-1].x,path[path.length-1].y]);
            var valid = validMove(next, dim, visited);
            if ( valid && anyValidPath([next[0],next[1]], end,  dim, visited)) {
                path.push({x:next[0],y:next[1]});
                visited[next[0]+'_'+next[1]] = 1;
            }
        }
        console.log(path+' path length: '+path.length);
        return path;
    };

    //object containing for functions corresponding to 4 neighbors of node in maze
    var getNeighbor =   {0: function(array) {
                            return [array[0] + 1,array[1]];
                           },
                         1: function(array) {
                            return [array[0] - 1,array[1]];
                           },
                         2: function(array) {
                             return [array[0],array[1] + 1];
                           },
                         3: function(array) {
                             return [array[0],array[1] - 1];
                           }};
      
    //return a node adjacent to path as start for false path


    var validFPath = function(nArray, lkUpObj, pathObj) {
        var key = nArray[0]+'_'+nArray[1];
        return (nArray[0] < 1 || nArray[0] > 10 || nArray[1] < 1 || nArray[1] > 10 || lkUpObj.hasOwnProperty(key) || pathObj.hasOwnProperty(key)) ? 0 : nArray;    
    };

    var getFalseNeighbor = function(pathArr, lkUpObj, pathObj) {
        var m;
        while (m = validFPath(randomMove([pathArr[pathArr.length-1].x,pathArr[pathArr.length-1].y]), lkUpObj, pathObj)) {
            pathArr.push({x:m[0],y:m[1]});
            lkUpObj[m[0]+'_'+m[1]] = 1;
        }
        return pathArr;
    };

    var createFalsePaths = function(pathv, pathObj) {
        var fPaths = [];
        var fPathsLkUp = {};
        for(var i = 0; i < pathv.length; i++) {
            console.log('starting f on new pNode'+pathv[i].x+'-'+pathv[i].y);
            for (var d = 0; d < 4; d++) {
                var n = getNeighbor[d]([pathv[i].x, pathv[i].y]);
                if (!pathObj.hasOwnProperty(n[0]+'_'+n[1]) && !fPathsLkUp.hasOwnProperty(n[0]+'_'+n[1])) {
                    console.log('should we add a fpath');
                    if (Math.floor(Math.random()*3) >= 0) {
                        var fp = [{x:pathv[i].x,y:pathv[i].y}, {x:n[0],y:n[1]}];
                        fPathsLkUp[n[0]+'_'+n[1]] = 1;
                        var ffp = getFalseNeighbor(fp, fPathsLkUp, pathObj);
                        fPaths.push(ffp);
                    }    
                }
            }
        }
        console.log(fPaths);
        return fPaths;
    };
    
    //record keyboard input-left-arrow:37 up-arrow:38 right-arrow:39 down-arrow:40
    $(window).keydown(function(e) {
        console.log(wallsOb);
        console.log(e.which);
        e.preventDefault();
        var moveMap = { 
                        37: function() {
                                return {x:this.x - 50,y: this.y};
                            },
                        38: function() {
                                return {x:this.x,y: this.y - 50};
                             },
                        39: function() {
                                return {x:this.x + 50,y: this.y};
                            },
                        40: function() {
                                return {x:this.x,y: this.y + 50};
                            },
                        72: function() {
                                return {x:this.x - 50,y: this.y};
                            },
                        75: function() {
                                return {x:this.x,y: this.y - 50};
                             },
                        76: function() {
                                return {x:this.x + 50,y: this.y};
                            },
                        74: function() {
                                return {x:this.x,y: this.y + 50};
                            }
                    };
        moveArc(e.which, offset, moveMap[e.which], wallsOb);
    });
   // $(document).ready(function() {
        var rPath = randomPath(starting, ending)
          , wallsOb = removePathWalls(createWallObject(dim), rPath)
          , fPaths = createFalsePaths(rPath, visited);

        console.log(rPath[0]);
        console.log(rPath[1]);
        console.log(fPaths);
    
        removeFPathWalls(wallsOb, fPaths);
        drawWalls(wallsOb, 50, offsetA);
} 
