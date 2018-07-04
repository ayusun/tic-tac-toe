const inquirer = require('inquirer');
const Player = require('../common/player.model');
const rules = require('../common/game.rules')

/**
 * The Controller class to inquire from the user
 */
class PlayerController{

    /**
     * Ask for the players for intialisation of the game
     */
    getPlayer(){
        let self = this
        return new Promise(function(resolve, reject){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'p1',
                    message: 'Enter Name for Player 1 \n >>'
        
                },
                {
                    type: 'input',
                    name: 'p2',
                    message: 'Enter Name for Player 2 \n >>'
        
                },
                {
                    type: 'input',
                    name: 'boardSize',
                    message: 'Enter Size of the Board \n >>',
                    validate: function(inp){
                        return parseInt(inp) >= rules.MIN_BOARD_SIZE //setting validation for min board size
                    }
        
                }
            ]).then(answer => {
                let p1 = new Player(answer.p1, 'X');
                let p2 = new Player(answer.p2, 'O');
                let players = {p1:p1, p2:p2};
                self.players = players;
                resolve({players:players, boardSize:answer.boardSize})
            });
    
        });
    }
    
    /**
     * On the basis of turn count. Ask the user to enter cells alternatively
     * @param {Number} turnCount Current turnCount.
     * 
     * @return Promise.<cell: Number, person: Person>
     */
    askPlayerToMove(turnCount){
        let self = this
        var person = turnCount % 2 == 1?self.players.p1:self.players.p2;
        return new Promise(function(resolve, rejected){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'cellSelected',
                    message: person.name + ", choose a box to place an " + person.symbol +" into: \n >>"
        
                }
            ]).then(answer => {
            resolve({cell: answer.cellSelected, person: person});  
            });
        });
    }
}

module.exports = PlayerController;