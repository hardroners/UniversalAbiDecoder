// import Web3 from "web3";
const {Web3} = require('web3')

const web3 = new Web3("ws://82.67.104.206:49253/");

module.exports = {
    web3: web3
}
