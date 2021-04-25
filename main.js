const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(grid){
    this.grid = grid;
    this._startPos = [3, 0];
    this.curPos = this._startPos;
    this.lastMove = '';
    this.lastMoveValid = true;
    }
    
    start(){
        console.clear();
        const notice = prompt('Welcome to Hatfinder! \n \nUse these for movement: \n  w - up \n  a - left \n  s - down \n  d - right \n  x - to exit \npress enter to continue...');
        while (myField.lastMove != 'x') myField.update();
    }
    print(){
        this.grid[this.curPos[0]][this.curPos[1]] = '*';
        for (let row in this.grid){
            console.log(this.grid[row].join(''));
        }
        if (!this.lastMoveValid){
            console.log(`Can't go that way...`)
        }
    }
    playerMovement(){
        console.log(`curPos: ${this.curPos}`)
        console.log(`grid height: ${this.grid.length}`)
        console.log(`grid width: ${this.grid[0].length}`)
            
        this.lastMoveValid = true;
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
            this.lastMoveValid = false;
        }
        else if(this.curPos[0] > this.grid.length - 1){
            this.curPos[0] -= 1;
            this.lastMoveValid = false;
        }
        else if(this.curPos[1] < 0){
            this.curPos[1] += 1;
            this.lastMoveValid = false;
        }
        else if(this.curPos[1] > this.grid[0].length - 1){
            this.curPos[1] -= 1;
            this.lastMoveValid = false;
        }
    }
    update(){
        console.clear();
        this.print();
        this.playerMovement();

    }
    
}

const myField = new Field([
  ['O', '░', 'O', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', 'O', '░', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', '^', '░','░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', 'O', '░', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', '^', '░','░', 'O', '░', 'O', '░', '░', 'O', '░']
]);


myField.start();
