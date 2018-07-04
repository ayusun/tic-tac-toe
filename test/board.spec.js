const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect;
chai.use(chaiAsPromised).should()

const Board = require('../lib/common/board');
const Player = require('../lib/common/player.model')
let boardObj;
let players = {};
beforeEach('setting up the board', function(){
    boardObj = new Board(4);
    players.p1 = new Player('test1', 'X');
    players.p2 = new Player('test2', 'O');
});
describe('Testing Game Board', function(){
    it('board is initialised with appropriate array size', function(){
        assert.equal(boardObj.getBoardArea(), 16)
    })

    it('start the game should resolve the promise', function(){
        boardObj.setupBoard(players.p1, players.p2).should.eventually.be.true
    })

    it('test a valid move', function(){
        boardObj.setupBoard(players.p1, players.p2).then(res => {
            boardObj.markBoard(1, players.p1).should.eventually.be.true
        })
    })

    it('test an invalid move', function(){
        boardObj.setupBoard(players.p1, players.p2).then(res => {
            boardObj.markBoard(1, players.p1).then((res)=>{
                boardObj.markBoard(1, players.p2).should.be.rejected
            })
        })
    })

    it('test if there is a winner in row', function(){
        console.log(expect);
        boardObj.setupBoard(players.p1, players.p2).then(res => {
            boardObj.markBoard(1, players.p1).then((res)=>{
                boardObj.markBoard(2, players.p1).then(res=>{
                    boardObj.markBoard(3, players.p1).then(res=>{
                        expect(boardObj.hasWinner(players.p1)).to.eventually.deep.equal({win:true, player:players.p1})
                    })
                })
            })
        })
    })

    it('test if there is a winner in column', function(){
        console.log(expect);
        boardObj.setupBoard(players.p1, players.p2).then(res => {
            boardObj.markBoard(1, players.p1).then((res)=>{
                boardObj.markBoard(5, players.p1).then(res=>{
                    boardObj.markBoard(9, players.p1).then(res=>{
                        expect(boardObj.hasWinner(players.p1)).to.eventually.deep.equal({win:true, player:players.p1})
                    })
                })
            })
        })
    })

    it('test if there is a winner in digonal', function(){
        console.log(expect);
        boardObj.setupBoard(players.p1, players.p2).then(res => {
            boardObj.markBoard(1, players.p1).then((res)=>{
                boardObj.markBoard(6, players.p1).then(res=>{
                    boardObj.markBoard(11, players.p1).then(res=>{
                        expect(boardObj.hasWinner(players.p1)).to.eventually.deep.equal({win:true, player:players.p1})
                    })
                })
            })
        })
    })

    it('test there is no winner', function(){
        console.log(expect);
        boardObj.setupBoard(players.p1, players.p2).then(res => {
            boardObj.markBoard(1, players.p1).then((res)=>{
                expect(boardObj.hasWinner(players.p1)).to.eventually.deep.equal({win:false, player:players.p1})
            })
        })
    })
})