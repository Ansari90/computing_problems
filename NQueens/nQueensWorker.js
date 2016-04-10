var N;
var squareArray = [];
var queenSquares = [];
var validSquares = [];

self.addEventListener('message', function(e) {
    N = e.data;   
    
    generateArrangement();
}, false);

function resetBoard() {
    squareArray = [];
    
    for(var i = 0; i < N; i++) {
        squareArray.push([]);
        for(var j = 0; j < N; j++) {
            squareArray[i].push(true);
        }
    }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function invalidateSquares(x, y) {
    //set every square on the row, column and diagonal to false
    var X,Y;
    
    //column squares
    for(Y = 0; Y < N; Y++) {
        squareArray[x][Y] = false;
    }
    
    //row squares
    for(X = 0; X < N; X++) {
        squareArray[X][y] = false;
    }    
    
    //diagonal1 - decreasing Y, decreasing X
    X = x;
    Y = y;
    while(X >= 0 && Y >= 0) {
        squareArray[X--][Y--] = false;
    }
        
    //diagonal2 - decreasing Y, increasing X
    X = x;
    Y = y;
    while(X < N && Y >= 0) {
        squareArray[X++][Y--] = false;
    }
    
    //diagonal3 - increasing Y, decreasing X
    X = x;
    Y = y;
    while(X >= 0 && Y < N) {
        squareArray[X--][Y++] = false;
    }
    
    //diagonal4 - increasing Y, increasing X
    X = x;
    Y = y;
    while(X < N && Y < N) {
        squareArray[X++][Y++] = false;
    }
}

function findValidSquares() {
    validSquares = [];
    for(var i = 0; i < N; i++) {
        for(var j = 0; j < N; j++) {
            if(squareArray[i][j] === true) {
                validSquares.push({
                    'x' : i,
                    'y' : j
                });
            }
        }
    }
}

function generateArrangement() {
    resetBoard();
    
    for(var queenCounter = 0; queenCounter < N; queenCounter++) {
        findValidSquares();
        
        if(validSquares.length > 0) {
            var queenSquare = validSquares[getRandomInt(0, validSquares.length)];
            queenSquares.push(queenSquare);
            invalidateSquares(queenSquare.x, queenSquare.y);
        }
        else {
            //Reset, start again
            queenCounter = -1;
            queenSquares = [];
            resetBoard();
        }
    }
    
    self.postMessage(queenSquares);
}