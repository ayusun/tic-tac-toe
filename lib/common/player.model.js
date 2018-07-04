/**
 * Player Class
 */
class Player {
    constructor(name, symbol){
        this.name = name;
        this.symbol = symbol;
    }

    getName(){
        return this.name;
    }

    getSymbol(){
        return this.symbol;
    }
}

module.exports = Player;