var CANVAS_EDGE;

self.addEventListener('message', function(e) {
    CANVAS_EDGE = e.data;
    generateSpiral();
}, false);

function isItPrime(primeCandidate) {
    var isPrime = true;
    
    if(primeCandidate == 1) { return false; }
    if(primeCandidate == 2) { return true; }
    
    if((primeCandidate%2) == 1) {
        for(var i = 2; i <= Math.ceil(primeCandidate/2); i++) {
            if(primeCandidate%i == 0) {
                isPrime = false;
                break;
            }
        }
    }
    else { isPrime = false; }
    
    return isPrime;
}

function inBounds(value) {
    return ((value >= 0 && value < CANVAS_EDGE) ? true : false);
}

function generateSpiral()
{
    var value = 1;
    var edgeNumber = 1;
    var numOfElementsOnEdge = 1;
    var elementCounter = 0;
    
    var x = CANVAS_EDGE/2;
    var y = CANVAS_EDGE/2;

    while(inBounds(x) && inBounds(y)) {        
        if(isItPrime(value)) {
            var squareToColor = new Object();
            squareToColor.x = x;
            squareToColor.y = y;
            self.postMessage(squareToColor);
        }

	value++;
        elementCounter++;

        switch(edgeNumber) {
            case 1:
                //move right
		x++;
		if(elementCounter == numOfElementsOnEdge) {
			edgeNumber++;
			elementCounter = 1;
			numOfElementsOnEdge += 2;
		}		
		break;
            case 2:
                //move up
		if(elementCounter == numOfElementsOnEdge) {
			edgeNumber++;
			elementCounter = 1;
			x--;
		} else { y--; }
		break;
            case 3:
                //move left		
		if(elementCounter == numOfElementsOnEdge) {
			edgeNumber++;
			elementCounter = 1;
			y++;
		} else { x--; }
		break;
            case 4:
                //move down		
		if(elementCounter == numOfElementsOnEdge) {
			edgeNumber = 1;
			elementCounter = 1;
			x++;
		} else { y++; }
            break;
        }
    }
}
