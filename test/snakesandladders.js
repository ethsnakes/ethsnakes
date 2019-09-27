const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const expectedExceptionPromise = require("../util/expected-exception-promise.js");
const getTransactionCost = require("../util/get-transaction-cost.js");
const { toWei, toBN, fromAscii } = web3.utils;

contract('SnakesAndLadders', (accounts) => {
    const [ owner, alice, bob, carol ] = accounts;
    let instance;

    before("running check if the setup is correct to pass the tests", async function() {
        let aliceBalanceBN = toBN(await web3.eth.getBalance(alice));
        let minimum = toBN(toWei('1', 'ether'));
        assert.isTrue(aliceBalanceBN.gte(minimum));
    });

    beforeEach("deploy and prepare", async function() {
        instance = await SnakesAndLadders.new({from: owner});
    });

    describe("adding balance to the contract", function() {
        const qty = toWei('0.01', 'ether');
        it("should not let anyone send eth directly", async function () {
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: alice, value: qty});
            });
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: owner, value: qty});
            });
        });
        it("should not let alice to send balance with add balance", async function () {
            return await expectedExceptionPromise(function () {
                return instance.addBalance({from: alice, value: qty});
            });
        });
        it("should let the owner send balance with add balance", async function () {
            let txObj = await instance.addBalance({from: owner, value: qty});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], owner, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });
    });
});
