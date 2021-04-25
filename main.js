const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(grid){
        [...this.grid] = [...grid];
        this.oGrid = [];
        this._startPos = [0, 0];
        this.curPos = [0, 0];
        this.lastMove = '';
        this.lastMoveValid = true;
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
    start(){
        console.clear();
        const notice = prompt('Welcome to Hatfinder! \n \nUse these for movement: \n  w - up \n  a - left \n  s - down \n  d - right \n  x - to exit \npress enter to continue...');
        this.copyGrid(this.grid, this.oGrid);
        this.update();
    }
    print(){
        console.log(this.grid)
        console.log('-----')
        console.log(this.oGrid)
        console.log('-----')
        console.log(field)
        this.grid[this.curPos[0]][this.curPos[1]] = '*';
        for (let row in this.grid){
            console.log(this.grid[row].join(''));
        }
    }
    playerMovement(){
        console.log(this._startPos)
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
        while (myField.lastMove != 'x' && this.lastMoveValid) {
            console.clear();
            this.print();
            this.playerMovement();
        }
        if (!this.lastMoveValid){
            this.restart();
        }

    }
    restart() {
        console.clear();
        [...this.curPos] = [...this._startPos];
        this.grid = [];
        this.copyGrid(this.oGrid, this.grid);
        
        console.log(`You died...`);
        let ans = prompt('Do you want to try again?(y/n)');
        
        if (ans === 'y') {
            this.lastMoveValid = true;
            this.update();
        }
        
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
