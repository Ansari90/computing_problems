var INTERVAL_ID = -1;
var NUM_OF_DISKS = -1;
var NON_SMALLEST_MOVE = false;
var MOVE_DIRECTION = "";

var towerList = [ [], [], [] ];

self.addEventListener('message', function(e) {
    console.log('inside worker!');
    NUM_OF_DISKS = e.data;
    for(var i = 0; i < NUM_OF_DISKS; i++) {
        towerList[0].push(i);
    }
    
    if(NUM_OF_DISKS % 2 === 0) {
        MOVE_DIRECTION = "right";
    } else {
        MOVE_DIRECTION = "left";
    }
    
    INTERVAL_ID = setInterval(moveDisk, 1000);    
}, false);

function moveDisk() {
    var moveOver = false;
    if(towerList[2].length != NUM_OF_DISKS) {
        towerList.forEach(function(tower, index, mainList) {
           if(tower[0] == 0 && moveOver === false) {
                if(NON_SMALLEST_MOVE === false) {
                    tower.shift();
                    
                    switch(MOVE_DIRECTION) {
                       case "right":
                           if(index === 2) {
                               mainList[0].unshift(0);
                           }
                           else {
                               mainList[index + 1].unshift(0);
                           }
                           break;
                       case "left":
                           if(index === 0) {
                               mainList[2].unshift(0);
                           }
                           else {
                               mainList[index - 1].unshift(0);
                           }
                           break;
                    }
                    
                    NON_SMALLEST_MOVE = true;
                    moveOver = true;
                } else {
                    var candidateTowerOne = -1, candidateTowerTwo = -1;
                    
                    for(var i = 0; i < 3; i++) {
                        if(i != index) {
                            if(candidateTowerOne === -1) {
                                candidateTowerOne = i;
                            } else {
                                candidateTowerTwo = i;
                            }
                        }
                    }
                    
                    if(mainList[candidateTowerOne].length === 0 || mainList[candidateTowerTwo].length === 0) {
                        if(mainList[candidateTowerOne].length === 0) {
                            mainList[candidateTowerOne].push(mainList[candidateTowerTwo].shift());
                        } else {                            
                            mainList[candidateTowerTwo].push(mainList[candidateTowerOne].shift());
                        }
                    } else {
                        if(mainList[candidateTowerOne][0] < mainList[candidateTowerTwo][0]) {
                           mainList[candidateTowerTwo].unshift(mainList[candidateTowerOne].shift());
                        } else {
                           mainList[candidateTowerOne].unshift(mainList[candidateTowerTwo].shift());
                        }
                    }                    
                    
                    NON_SMALLEST_MOVE = false;
                    moveOver = true;
                }
           }
        });
    } else {
       clearInterval(INTERVAL_ID);
    }
    
    self.postMessage(towerList);
}