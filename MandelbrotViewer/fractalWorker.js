var paramList;

var MANDELBROT_ESCAPE_RADIUS_POWER_2 = Math.pow(2, 2);

var RGB_MAX = 256;
var COLOR_INCREMENT;

onmessage = function(e) {
    paramList = e.data;
    
    COLOR_INCREMENT = Math.round(paramList.MAX_ITERATIONS/RGB_MAX);
    //COLOR_INCREMENT = Math.round((3 * RGB_MAX)/paramList.MAX_ITERATIONS);
    
    generateCompleteMap();
}

function generateCompleteMap() {
	var coordArray = new Array(paramList.CANVAS_EDGE);
	
	for(var x = 0; x < paramList.CANVAS_EDGE; x++) {
		coordArray[x] = new Array(paramList.CANVAS_EDGE);
        
		for(var y = 0; y < paramList.CANVAS_EDGE; y++) {
			coordArray[x][y] = getColor(iterationsToInfinity(x, y));
		}
	}
	
	postMessage(coordArray);
}

function iterationsToInfinity(x, y) {
    var iterations = 0;
    var realPart = 0.0, imaginaryPart = 0.0, tempX = 0.0;
    var scaledX = scaleCoords(x + paramList.X_SHIFT, 'x'), scaledY = scaleCoords(y + paramList.Y_SHIFT, 'y');

    while(Math.pow(realPart, 2) + Math.pow(imaginaryPart, 2) < MANDELBROT_ESCAPE_RADIUS_POWER_2 && iterations < paramList.MAX_ITERATIONS) {
        tempX = Math.pow(realPart, 2) - Math.pow(imaginaryPart, 2) + scaledX;

        imaginaryPart = 2 * imaginaryPart * realPart + scaledY;
        realPart = tempX;

        iterations++;
    }
    
    return iterations;
}

function scaleCoords(coord, axis) {
    var sign = 1, scaleFactor = 1;
    
    //Complex Plane Basics: Subtracting CUTOFF from the real part would leave us with the appropriate -ve or +ve values
    //Values for the imaginary part need to have their signs reversed (left to right for x, top to bottom for y on the canvas)
    coord -= paramList.CUTOFF;

    if(axis == 'x') {
        scaleFactor = paramList.X_SCALE;
        sign = 1;
    }
    else {
        scaleFactor = paramList.Y_SCALE;
        sign = -1;
    }

    return ((coord * sign)/scaleFactor);
}

function getColor(iterations) {
    var rgbNumArray = [0, 0, 0];
    var index = 0;
    
    if(iterations != paramList.MAX_ITERATIONS) {
        for(var counter = 0; iterations > 0; iterations--) {
            if(rgbNumArray[counter] + COLOR_INCREMENT < RGB_MAX) {
                rgbNumArray[counter] += COLOR_INCREMENT;
            }
            else {
                if(counter < 2) {
                	iterations++;	//to make up for the color assignment that would otherwise be skipped
                	counter++; 		//in this step
                }
                else { break; }
            }
        }

    }
    
    /*
    if(iterations < paramList.MAX_ITERATIONS) {
        if(iterations > paramList.MAX_ITERATIONS - (paramList.MAX_ITERATIONS/3)) {
            index = 0;
        }
        else {
            if(iterations > paramList.MAX_ITERATIONS -  (2 * (paramList.MAX_ITERATIONS/3))) {
                index = 1;
            }
            else {
                index = 2;
            }
        }

        while(iterations > 0) {
            rgbNumArray[index] += COLOR_INCREMENT;

            iterations--;
        } 
    }
    */

    return "rgb(" + rgbNumArray[0] + "," + rgbNumArray[1] + "," + rgbNumArray[2] + ")";
}