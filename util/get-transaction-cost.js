/**
 * Returns the transaction cost given a transaction object.
 *
 * @param txObj
 * @returns {BigNumber}
 */
module.exports = async function getTransactionCost(txObj) {
    let gasUsed = web3.utils.toBN(txObj.receipt.gasUsed);
    let tx = await web3.eth.getTransaction(txObj.tx);
    let gasPrice = web3.utils.toBN(tx.gasPrice);
    return gasPrice.mul(gasUsed);
};