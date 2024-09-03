const {Interface, AbiCoder} = require("ethers")
const {universalAbi} = require("./UNIVERSAL_ABI.js");


const swapCodes = {
    "00": "V3_SWAP_EXACT_IN",
    "01": "V3_SWAP_EXACT_OUT",
    "08": "V2_SWAP_EXACT_IN",
    "09": "V2_SWAP_EXACT_OUT",
    "0a": "PERMIT2_PERMIT",
    "0b": "WRAP_ETH"
};


let universalInterface = new Interface(universalAbi);

function decodedExecute(transactionData){
    const parsedTx = universalInterface.parseTransaction({data: transactionData.input})
    
    if (!parsedTx) return
    const command = parsedTx.args[0].substring(2).match(/.{1,2}/g)
    let foundFunction;
    let inputForFunction;
    command.forEach(
        commandCode => {
            const currentIndex = Object.keys(swapCodes).indexOf(commandCode)
            if (currentIndex !== -1) {
                foundFunction = commandCode;
                inputForFunction = parsedTx.args[1][command.indexOf(commandCode)];
            }
        }
    )

    if (swapCodes[foundFunction] != "V2_SWAP_EXACT_IN") return
    const abiCoder = new AbiCoder();
    let decoded = abiCoder.decode(["address", "uint256", "uint256", "address[]", "bool"], inputForFunction);
    return {
        function: swapCodes[foundFunction],
        recipient: decoded[0],
        amountIn: decoded[1].toString(),
        amountOutMin: decoded[2].toString(),
        path: decoded[3],
        payerIsUser: decoded[4]
    }
}

module.exports  = {
    decodedExecute: decodedExecute
}