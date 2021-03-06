const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = '0';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(){
        this.width = 25;
        this.height = 25;
        this.minPath = Math.floor((this.width + this.height) / 2);
        this.grid = [];
        this.oGrid = [];
        this._startPos = [];
        this._endPos = [];
        this.curPos = [0, 0];
        this.lastMove = '';
        this.isAlive = true;
        this.won = false;
        this.wins = 0;
        this.lives = 3;
    }

    start(){
        console.clear();
        const notice = prompt('Welcome to Hatfinder! \n \nUse these for movement: \n  w - up \n  a - left \n  s - down \n  d - right \n  x - to exit \npress enter to continue...');
        let test = this.generateAndTestMap();

            if( test != null){
                this.copyGrid(this.grid, this.oGrid);
                [...this.curPos] = [...this._startPos];
                this.update();                
        }
    }
    ///copies grids
    copyGrid(base, target){
        let x = [];

        for( let i = 0; i < base.length; i++){
            for( let j = 0; j < base[i].length; j++){
                x.push(base[i][j])
            }
            target.push(x);
            x = [];
        }
    }
    //generates & tests grids until it finds a playable one
    //returns a walkable path path
    generateAndTestMap(){
        let test = null;
        let ok = false
        while(test === null && !ok) {
            this.generateField();

            let pf = new Pathfinding(this);
            test = pf.findPath()
        }
        if(test.length < this.minPath) test = this.generateAndTestMap();
        return test;
    }
    //simple update cycle checking for game states
    update(){
        while (this.lastMove != 'x' && this.isAlive && !this.won) {
            console.clear();
            this.print(this.grid);
            this.playerMovement();
        }

        if (!this.isAlive || this.won){
            this.restart();
        }
    }
    //prints grid maps
    print(grid){
        grid[this.curPos[0]][this.curPos[1]] = pathCharacter;

        console.log('wins: ' + this.wins);
        for (let row in grid){
            console.log(grid[row].join(''));
        }
    }
    //this handles user input and player state
    playerMovement(){

        this.isAlive = true;
    
        const move = prompt('Which way? ');
        this.lastMove = move;
        
        switch (move){
            case 'w': {
                this.curPos[0] -= 1;
                break;
            }
            case 'a': {
                this.curPos[1] -= 1;
                break;
            }
            case 's': {
                this.curPos[0] += 1;
                break;
            }
            case 'd': {
                this.curPos[1] += 1;
                break;
            }
            default : {
            }
        }
        //out of bounds kills player
        if(this.curPos[0] < 0){
            this.curPos[0] += 1;
            this.isAlive = false;
        }
        else if(this.curPos[0] > this.grid.length - 1){
            this.curPos[0] -= 1;
            this.isAlive = false;
        }
        else if(this.curPos[1] < 0){
            this.curPos[1] += 1;
            this.isAlive = false;
        }
        else if(this.curPos[1] > this.grid[0].length - 1){
            this.curPos[1] -= 1;
            this.isAlive = false;
        }
        
        //holes too
        else if(this.grid[this.curPos[0]][this.curPos[1]] === hole){
            this.isAlive = false;
        }
        //hat wins
        else if(this.grid[this.curPos[0]][this.curPos[1]] === hat){
            this.won = true;
            this.wins++
        }
        
    }
    // restarts game based on player state(retry on death, new map on win)
    restart() {
        console.clear();
        this.curPos = [];
        [...this.curPos] = [...this._startPos];
        this.grid = [];
        
        if(!this.isAlive) {
            console.log(`You died...`);
        }
        else if (this.won){
            console.log(`You found your hat!`);
        }

        let ans = prompt('Do you want to play again?(y/n)');
        
        if (ans === 'y' && !this.isAlive) {
            this.isAlive = true;
            this.copyGrid(this.oGrid, this.grid);
            this.update();
        }
        else if (ans === 'y' && this.won) {
            this.won = false;
            let test = this.generateAndTestMap();

            if(test != null) {
                this.oGrid = [];
                this.copyGrid(this.grid, this.oGrid);
                [...this.curPos] = [...this._startPos];
                this.update();
            }
        }
    }   
    //generates grid map
    generateField(){
        let arr = [];
        let tile = "";
        let newGrid = [];
        let gotHat = false;
        let gotStart = false;
        let rNum = 0;
        for( let i = 0; i < this.width; i++){
            for( let j = 0; j < this.height; j++){
                rNum = Math.floor(Math.random()*2);

                switch (rNum) {
                    case 0:
                        tile = fieldCharacter;
                        break;
                    case 1:
                        tile = hole;
                        break;
                    default:
                        break;
                }
                arr.push(tile)
            }
            newGrid.push(arr);
            arr = [];
        }

        while (!gotStart){
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);
            this._startPos = [x, y];
            newGrid[x][y] = pathCharacter;
            gotStart = true;
        }

        while (!gotHat) {
            let x = Math.floor(Math.random() * this.width);
            let y = Math.floor(Math.random() * this.height);

            if(newGrid[x][y] === pathCharacter){
                continue;
            }
            else {
                newGrid[x][y] = hat;
                this._endPos = [x, y];
                gotHat = true;
            }
        }
        this.grid = newGrid;
    }
}
class Pathfinding {
    constructor(field){
        this.STRAIGHT_COST = 10;

        this.field = field;
        this.width = field.width;
        this.height = field.height;

        this.nodeList = [];
        this.openList = [];
        this.closedList = [];
    }
    findPath(){
        //populate node list
        for (let x = 0; x < this.field.width; x++){
            for(let y = 0; y < this.field.height; y++){
                let pathNode = new PathNode([x, y]);
                pathNode.gCost = Number.MAX_SAFE_INTEGER;
                pathNode.calculateFCost();
                pathNode.cameFromNode = null;
                
                this.field.grid[x][y] === hole ? pathNode.isWalkable = false : pathNode.isWalkable = true;
                
                this.nodeList.push(pathNode);
            }
        }
        //create start node
        let startNode = new PathNode(this.field._startPos);

        //find end node in list
        let endNode = this.getNode(this.nodeList, this.field._endPos);

        //set costs
        startNode.gCost = 0;
        startNode.hCost = this.calculateDistance(startNode, endNode);
        startNode.calculateFCost();
        //add startnode to open list
        this.openList.push(startNode);
        
        while(this.openList.length > 0) {
            let currentNode = this.getLowestFCostNode(this.openList);

            if (currentNode === endNode) {
                return this.calculatePath(endNode);
            }

            let idx = this.openList.indexOf(currentNode);
            if(idx != -1){
                this.openList.splice(idx, 1);

                this.closedList.push(currentNode);
            }
            //iterate through neighbour nodes
            let neighbours = this.getNeighbourList(currentNode);
            for (let neighbourNode of neighbours){
                //remove "hole" nodes
                if(!neighbourNode.isWalkable){
                    this.closedList.push(neighbourNode);
                }
                //check if this is in closed list, if yes skip it...
                if(this.closedList.indexOf(neighbourNode) != -1) {

                    continue;
                }

                //calculate tentative G cost, if it is lower than the actual gcost then set the cameFromNode to the current node & recalculate all costs for the neighbour

                let tentativeGCost = currentNode.gCost + this.calculateDistance(currentNode, neighbourNode);
                if (tentativeGCost < neighbourNode.gCost) {
                    neighbourNode.cameFromNode = currentNode;
                    neighbourNode.gCost = tentativeGCost;
                    neighbourNode.hCost = this.calculateDistance(neighbourNode, endNode);
                    neighbourNode.calculateFCost();

                    //check open list & add the neighbour if not present
                    if(this.openList.indexOf(neighbourNode) === -1){
                        this.openList.push(neighbourNode);
                    }
                }
            }
        }
        // Out of nodes on open list
        return null;
    }
    getNeighbourList(currentNode){
        let neighbourList = [];

        //left
        if ((currentNode.pos[0] - 1) >= 0) {
            neighbourList.push(this.getNode(this.nodeList, [currentNode.pos[0] - 1, currentNode.pos[1]] ));
        }
        //right
        if ((currentNode.pos[0] + 1) < this.height){
            neighbourList.push(this.getNode(this.nodeList, [currentNode.pos[0] + 1, currentNode.pos[1]] ));
        }
        //up
        if ((currentNode.pos[1] - 1) >= 0) {
            neighbourList.push(this.getNode(this.nodeList, [currentNode.pos[0], currentNode.pos[1] - 1] ));
        }
        //down
        if ((currentNode.pos[1] + 1) < this.width){
            neighbourList.push(this.getNode(this.nodeList, [currentNode.pos[0], currentNode.pos[1] + 1] ));
        }
        return neighbourList;
    }
    getNode(nodeList, targetPos){
        let node;
        for (let i = 0; i < nodeList.length; i++){
            if (nodeList[i].pos[0] === targetPos[0] && nodeList[i].pos[1] === targetPos[1]) {
                node = nodeList[i];
            }       
        }
        return node;
    }
    calculatePath(endNode){
        const path = [];
        path.push(endNode);
        let currentNode = endNode;
        while(currentNode.cameFromNode != null) {
            path.push(currentNode.cameFromNode);
            currentNode = currentNode.cameFromNode;
        }
        path.reverse();
        return path;
    }
    calculateDistance(a, b){
        let xDistance = Math.abs(a.pos[0] - b.pos[0]);
        let yDistance = Math.abs(a.pos[1] - b.pos[1]);
        //using manhattan distance (4 directions, no diagonal movement)
        return this.STRAIGHT_COST * (xDistance + yDistance);
    }
    getLowestFCostNode(nodeList){
        let lowestFCostNode = nodeList[0];
        for (let i = 0; i < nodeList.length; i++) {
            if(nodeList[i].fCost > lowestFCostNode.fCost){
                lowestFCostNode = nodeList[i];
            } 
        }
        return lowestFCostNode;
    }
}
class PathNode {
    constructor(pos){
        this.pos = pos;

        this.gCost;
        this.hCost;
        this.fCost;

        this.isWalkable;
        this.cameFromNode;
    }
    calculateFCost(){
        this.fCost = this.gCost + this.hCost;
    }
}

//instantiate and start game
const newGame = new Field();
newGame.start();
