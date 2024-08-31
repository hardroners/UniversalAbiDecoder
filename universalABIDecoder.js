const fs = require("fs");
const {Interface, AbiCoder} = require("ethers")
const {web3} = require("./web3.js")
const {universalAbi} = require("./UNIVERSAL_ABI.js")


let universalInterface = new Interface(universalAbi);

function decodedExecute(transactionData){
    const parsedTx = universalInterface.parseTransaction({data: transactionData})
    if (null != parsedTx) return
    console.log(parsedTx)
}


web3.eth.subscribe('pendingTransactions').then(subscription => {
    subscription.on('data', async (tx) => {
        const transaction = await web3.eth.getTransaction(tx);
        // console.log(transaction)
        decodedExecute(transaction.input)
    })
})

