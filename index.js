const ConsoleGameController = require('./lib/consoleImpl/console-game.controller')
// entry point of the game
//depending on the requirement, load different controller
let gameObj = new ConsoleGameController();
gameObj.startGame(); 
