const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const expectedExceptionPromise = require("../util/expected-exception-promise.js");
const getTransactionCost = require("../util/get-transaction-cost.js");
const { toWei, toBN, fromAscii } = web3.utils;

contract('SnakesAndLadders', (accounts) => {
    const [ owner, alice, bob, carol ] = accounts;
    let instance;
    const qty = toWei('0.01', 'ether');
    const qtyBN = toBN(qty);

    before("running check if the setup is correct to pass the tests", async function() {
        let aliceBalanceBN = toBN(await web3.eth.getBalance(alice));
        let minimum = toBN(toWei('1', 'ether'));
        assert.isTrue(aliceBalanceBN.gte(minimum));
    });

    beforeEach("deploy and prepare", async function() {
        instance = await SnakesAndLadders.new({from: owner});
    });

    describe("sending funds to play", function() {

        it("should let alice can add funds", async function () {
            let txObj = await instance.addBalance({from: alice, value: qty});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });

        it("should let bob add funds", async function () {
            let txObj = await instance.addBalance({from: bob, value: qty});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], bob, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });

        it("should let owner add funds", async function () {
            let txObj = await instance.addBalance({from: owner, value: qty});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], owner, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });
    });

    describe("playing the game", function() {

        beforeEach("add some funds", async function() {
            await instance.addBalance({from: alice, value: qty});
        });

        it("testing a normal game", async function () {
            let txObj = await instance.play(qty/100, {from: alice});
            // Check event
            assert.strictEqual(txObj.logs.length > 1, true, "More than one event expected");
            for (let i = 0; i < txObj.logs.length(); i++) {
                let args = txObj.logs[0].args;
                console.log(args);
            }
        });
    });

    describe("adding balance to the contract", function() {

        it("should not let alice send eth directly", async function () {
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: alice, value: qty});
            });
        });

        it("should not let owner send eth directly", async function () {
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: owner, value: qty});
            });
        });

        it("should not let alice to send balance with add balance", async function () {
            return await expectedExceptionPromise(function () {
                return instance.addFunds({from: alice, value: qty});
            });
        });

        it("should let the owner send balance with add balance", async function () {
            let txObj = await instance.addFunds({from: owner, value: qty});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], owner, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });
    });

    describe("remove balance from the contract", function() {

        beforeEach("add some balance", async function() {
            await instance.addFunds({from: owner, value: qty});
        });

        it("should not let alice remove balance", async function () {
            return await expectedExceptionPromise(function () {
                return instance.withdrawFunds({from: alice});
            });
        });

        it("should let the owner remove balance", async function () {
            let txObj = await instance.withdrawFunds({from: owner});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], owner, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });
    });
});
