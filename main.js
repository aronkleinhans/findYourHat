const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(grid){
    this.grid = grid;
    this.curPos = [0, 0];
    this.nextPos = [0, 0];
    }
    
    startNotice(){
        console.clear();
        const notice = prompt('Welcome to Hatfinder! \n \n Use these for movement: \n w - up \n a - left \n s - down \n d - right \n \n press enter to continue...')
    }
    print(){
        for (let row in this.grid){
            console.log(this.grid[row].join(''));
        }
    }
    playerMovement(){
        console.log(`prevPos: ${this.prevPos}`)
        console.log(`curPos: ${this.curPos}`)
        console.log(`grid height: ${this.grid.length}`)
        console.log(`grid width: ${this.grid[0].length}`)
            
        const move = prompt('Which way?');
        switch (move){
            case 'w': {
                this.nextPos[0] = this.curPos[0] - 1;
                break;
            }
            default : {
                console.log('no input received')
            }
        }
        if(this.nextPos[0] > 0 && this.nextPos[0] < this.grid.length && this.nextPos[1] > 0 && this.nextPos[1] < this.grid[0].length) {
            this.curPos = this.nextPos;
        }
    }
    update(){
        console.clear();
            this.grid[this.curPos[0]][this.curPos[1]] = '*';
            this.prevPos = this.curPos;

        this.print();
        this.playerMovement();

    }
    
}

const myField = new Field([
  ['*', '░', 'O', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', 'O', '░', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', '^', '░','░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', 'O', '░', '░', 'O', '░', 'O', '░', '░', 'O', '░'],
  ['░', '^', '░','░', 'O', '░', 'O', '░', '░', 'O', '░']
]);
myField.startNotice();
myField.print();
myField.playerMovement();
while (0 != 1) myField.update();
