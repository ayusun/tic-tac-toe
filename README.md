TIC TAC TOE
===========

Overview
--------

A N X N 2-Player Tic Tac Toe written in NodeJS. Current implementation only supports console. This can be extended in the future to support various other medium also(for example web, Alexa)

The rules of the game can be configured in the `game.rules.js`
Currently the Game has following features
- Either User winning/Draws
- Custom Board Size Selection by user input
- Changing window evaluation size(Currently `3`,can be changed from rules)
- Cap on number of times wrong move can be played in the game


Tech Used
---------
Node JS
Chai

Getting Started
---------------
1) Clone the code by `git clone https://github.com/ayusun/tic-tac-toe.git`
2) `cd tic-tac-toe`
3) `npm install`
4) `node index.js`

### To Test
`npm test`

### Future Work
- Persisting Sessions in Database
- Adding New Interfaces for the game
- Multiple Games and Score Tables
- maintaining History