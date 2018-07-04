const Board = require('../common/board');
const PlayerController = require('./player-controller');
const rules = require('../common/game.rules')
class ConsoleGameController {

    constructor(){
        var self = this
        self.gameStart = false;
        self.boardObj = undefined;
        self.winnerFound = false;
        self.invalidMoveCount = 0;
        self.playerControllerObj = new PlayerController();

    }
    /**
     * Start Game
     */
    startGame() {
        var self = this
        self.playersPromise = self.playerControllerObj.getPlayer()

        self.playersPromise.then(answer => {
            self.boardObj = new Board(answer.boardSize)
            return self.boardObj.setupBoard(answer.players.p1, answer.players.p2)}).then(start => {
            self.gameStart = start;
            self.eachRound(1);
        })
    }

    /**
     * This method will be called each time for every iteration
     * @private
     */
    eachRound(turnCount){
        var self = this
        if(turnCount <= self.boardObj.getBoardArea() && !self.winnerFound && self.gameStart && self.invalidMoveCount <= rules.MAX_INVALID_COUNT){
            let movePromise = self.playerControllerObj.askPlayerToMove(turnCount);
            let boardPromise = movePromise.then(answer => self.boardObj.markBoard(answer.cell, answer.person))
            Promise.all([movePromise, boardPromise]).then(function([resPerson, movRes]){
                return self.boardObj.hasWinner(resPerson.person);
            })            
            .then(result => {
                if(result.win){
                    console.log("Congratulations " + result.player.name + "! you have won");
                    self.winnerFound = true;
                }
                turnCount++;
                self.eachRound(turnCount)
            })
            //for now only invalid move can trigger this
            .catch(err => {
                self.invalidMoveCount++;
                console.log("Invalid Move Count = " + self.invalidMoveCount + " Maximum is " + rules.MAX_INVALID_COUNT)
                self.eachRound(turnCount);
            })
        } else if(self.invalidMoveCount > rules.MAX_INVALID_COUNT){
            console.log("Maximum Number of Invalid Moves passed. Shutting the game")
    
        } else if(turnCount > self.boardObj.getBoardArea()){
            console.log("No Winner Found. Match Draw!!!")
        }

    }
}
module.exports = ConsoleGameController