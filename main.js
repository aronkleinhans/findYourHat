const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(grid){
        this.gridSize = [10, 22];
        this.grid = [];
        this.oGrid = [];
        this._startPos = [];
        this.curPos = [0, 0];
        this.lastMove = '';
        this.isAlive = true;
        this.won = false;
    }

    start(){
        console.clear();
        const notice = prompt('Welcome to Hatfinder! \n \nUse these for movement: \n  w - up \n  a - left \n  s - down \n  d - right \n  x - to exit \npress enter to continue...');
        this.grid = this.generateField();
        this.copyGrid(this.grid, this.oGrid);
        [...this.curPos] = [...this._startPos];
        this.update();
    }

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

    update(){
        while (myField.lastMove != 'x' && this.isAlive && !this.won) {
            console.clear();
            this.print();
            this.playerMovement();
        }

        if (!this.isAlive || this.won){
            this.restart();
        }
    }

    print(){
        this.grid[this.curPos[0]][this.curPos[1]] = pathCharacter;

        for (let row in this.grid){
            console.log(this.grid[row].join(''));
        }
    }

    playerMovement(){
        console.log('startPos:');
        console.log(this._startPos);
        console.log(`curPos: ${this.curPos}`);
        console.log(`grid height: ${this.grid.length}`);
        console.log(`grid width: ${this.grid[0].length}`);

        this.isAlive = true;
    
        const move = prompt('Which way? ');
        this.lastMove = move;
        
        switch (move){
            case 'w': {
                this.curPos[0] = this.curPos[0] - 1;
                break;
            }
            case 'a': {
                this.curPos[1] = this.curPos[1] - 1;
                break;
            }
            case 's': {
                this.curPos[0] = this.curPos[0] + 1;
                break;
            }
            case 'd': {
                this.curPos[1] = this.curPos[1] + 1;
                break;
            }
            default : {
            }
        }

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
        
        else if(this.grid[this.curPos[0]][this.curPos[1]] === 'O'){
            this.isAlive = false;
        }
        else if(this.grid[this.curPos[0]][this.curPos[1]] === '^'){
            this.won = true;
        }
        
    }

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
            this.copyGrid(this.generateField(), this.grid);
            this.oGrid = [];
            this.copyGrid(this.grid, this.oGrid);
            [...this.curPos] = [...this._startPos];
            this.update();

        }
    }   
    generateField(){
        let arr = [];
        let tile = "";
        let newField = [];
        let gotHat = false;
        let gotStart = false;
        let rNum = 0;
        for( let i = 0; i < this.gridSize[0]; i++){

            for( let j = 0; j < this.gridSize[1]; j++){

                rNum = Math.floor(Math.random()*2);

                switch (rNum) {
                    case 0:
                        tile = fieldCharacter;
                        break;
                    case 1:
                        tile = hole;
                        break;
                    case 2:
                        tile = hat;
                        gotHat = true;
                        break;
                    case 3:
                        tile = pathCharacter;
                        
                    default:
                        break;
                }

                arr.push(tile)
            }
            newField.push(arr);
            arr = [];
        }

        while (!gotStart){
            let x = Math.floor(Math.random() * this.gridSize[0]);
            let y = Math.floor(Math.random() * this.gridSize[1]);
            this._startPos = [x, y];
            newField[x][y] = pathCharacter;
            gotStart = true;
        }

        while (!gotHat) {
            let x = Math.floor(Math.random() * this.gridSize[0]);
            let y = Math.floor(Math.random() * this.gridSize[1]);
            newField[x][y] = hat;
            gotHat = true;
        }

        return newField;
    } 
}


const field = [
    ['O', '░', 'O', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
    ['░', 'O', '░', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
    ['░', '^', '░','░', 'O', '░', 'O', '░', '░', 'O', '░'],
    ['░', 'O', '░', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
    ['░', '^', '░','░', 'O', '░', 'O', '░', '░', 'O', '░']
    ];



const myField = new Field(field);


myField.start();
