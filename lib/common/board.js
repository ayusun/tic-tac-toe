const rules = require('./game.rules')
const errors = require('./error')

/**
 * The Class Board which deals with everything that happens on theboard
 */
class Board {

    constructor(size){
        this.board = [];
        if(size != undefined){
            this.boardSize = size;
        } else {
            this.boardSize = rules.MIN_BOARD_SIZE;
        }
        
    }

    /**
     * Setup Board
     * @param {Player} p1 
     * @param {Player} p2
     * @returns Promise.<Boolean> 
     */
    setupBoard(p1, p2){
        var self = this;
        return new Promise(function(resolve, reject){
            let count = 1;
            for(var i = 0;i < self.boardSize;i++){
                self.board.push([0]);
                for(var j = 0; j < self.boardSize;j++){
                    self.board[i][j] = count;
                    count++;
                }
            }
            self.p1 = p1;
            self.p2 = p2;
            self.printBoard();
            resolve(true);
        })

    }

    /**
     * return Board Array
     */
    getBoard(){
        return this.board;
    }

    /**
     * 
     * Print Current state of the Board
     */
    printBoard(){
        var self = this
        for(var i = 0;i < self.boardSize;i++){
            var consoleRow = "";
            for(var j = 0; j < self.boardSize - 1;j++){
                consoleRow += self.board[i][j] + " | "
            }
            consoleRow += self.board[i][self.boardSize - 1];
            console.log(consoleRow);
            console.log("-------------")
        }
    
    }

    /**
     * Returns the Board Area.
     * Example: If the board size is 3 rows and 3 cols. The board Area is  3 X 3 = 9
     */
    getBoardArea(){
        return this.boardSize * this.boardSize;
    }
    

    /**
     * This takes the sliding window and check if all the elements are same as the symbol. If same, we got the winner
     * @param {String} symbol 
     * @param {Array} arr 
     */
    verifyContinousElementsAreSame(symbol, arr){
        let result = true;
        for(let i = 0; i < arr.length;i++){
            if(arr[i] !== symbol){
                result = false;
                break;
            }
        }
        return result;
    }

    /**
     * Verify the winner by looking at the rows in the sliding window.
     * It returns true if all the element inside the sliding window is same asthe symbol
     * @param {String} symbol symbol by the current user
     * @returns Boolean
     */
    verifyRowWinner(symbol){
        let rowWinner = true;
        var self = this
   
        for(var i = 0; i < self.boardSize;i++){
            rowWinner = true;
            let elementsWindow = [];
            for(var j = 0;j < self.boardSize; j++){
               if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                   elementsWindow.splice(0, 1);
               }
               elementsWindow.push(self.board[i][j]);
               
               if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                rowWinner = this.verifyContinousElementsAreSame(symbol, elementsWindow);
                if(rowWinner){
                    return true;
                }
               }
            }
            if(rowWinner){
                return true;
            }
        }
        return rowWinner;
    
    }
    
    /**
     * Verify the winner by looking at the columns in a sliding window fashion.
     * It return true, if any of the sliding window has all the same elements as the symbol
     * @param {String} symbol symbol to be used by current user
     * @returns Boolean
     */
    verifyColWinner(symbol){
        let colWinner = true;
        let self = this
    
        for(var i = 0; i < self.boardSize;i++){
            colWinner = true;
            let elementsWindow = [];
            for(var j = 0;j < self.boardSize; j++){
                if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                    elementsWindow.splice(0,1);
                }
                elementsWindow.push(self.board[j][i]);
                if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                    colWinner = this.verifyContinousElementsAreSame(symbol, elementsWindow);
                    if(colWinner){
                        return true;
                    }
                }
            }
            if(colWinner){
                return true;
            }
        }
        return colWinner;
    
    } 
    
    /**
     * Verify the winner by looking at the digonal items. It looks iterm in sliding window format
     * and returns true, if all the items in the sliding window are same as symbol
     * @param {string} symbol
     * @returns Boolean
     */
    verifyDigonalWinner(symbol){
        let winner = true;
        let self = this
        let elementsWindow = [];
        for(var i = 0; i < self.boardSize;i++){
            if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                elementsWindow.splice(0, 1);
            }
            elementsWindow.push(self.board[i][i]);
            if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                winner = self.verifyContinousElementsAreSame(symbol, elementsWindow);
                if(winner){
                    return true;
                }
            }
    
        }
        if(!winner){
            winner = true;
            elementsWindow = [];
            for(var i = 0; i < self.boardSize;i++){
                if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                    elementsWindow.splice(0, 1);
                }
                elementsWindow.push(self.board[i][i]);
                if(elementsWindow.length == rules.EVALUATION_WINDOW_SIZE){
                    winner = self.verifyContinousElementsAreSame(symbol, elementsWindow);
                    if(winner){
                        return true;
                    }
                }
        
            }
    
        }
        return winner;
    }

    /**
     * 
     * check whether the game has a winner or not with the particlar player
     * @param {*} player player model
     * 
     * @returns {Promise.<{win: Boolean, player: player}>}
     */
    hasWinner(player){
        let self = this
        return new Promise(function(resolve, reject){
            let result =  self.verifyColWinner(player.symbol) || self.verifyRowWinner(player.symbol) || self.verifyDigonalWinner(player.symbol);
            resolve({win:result, player: player});
        });
    }


    /**
     * Check whether the move is a valid move or not
     * @param {Number} num index selected by the user 
     * @param {Number} row the row of the board of the targeted cell, (calculated from num)
     * @param {Number} col the col of the board of the targeted cell, (calclated from num)
     */
    isValidMove(num, row, col){
        return (Number.isInteger(this.board[row][col]) && num > 0 && num <= this.getBoardArea())
    }

    /**
     * Make the user mark the unmarked cell. If User tries to make an Invalid move,
     * the promise gets rejected(so handle that!)
     * 
     * @param {Number} num Depicts the cell selected by the user 
     * @param {*} player Player Model
     */
    markBoard(num, player){
        let self = this
        return new Promise(function(resolve, reject){
            let row = (num % self.boardSize == 0)? ((num / self.boardSize) - 1) : Math.floor(num / self.boardSize);
            let col = (num % self.boardSize == 0) ? (self.boardSize - 1) : (num % self.boardSize) - 1;
            if(self.isValidMove(num, row, col)){ //testing the validity of the move
                self.board[row][col] = player.symbol;
                self.printBoard();
                resolve(true);
            } else {
                reject(errors.INVALID_MOVE)
            }    
        })
    }

}
module.exports = Board;