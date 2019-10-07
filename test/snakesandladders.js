const SnakesAndLadders = artifacts.require("SnakesAndLaddersMock.sol");
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
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });

        it("should let bob add funds", async function () {
            let txObj = await instance.addBalance({from: bob, value: qty});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], bob, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });

        it("should let owner add funds", async function () {
            let txObj = await instance.addBalance({from: owner, value: qty});
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

        it("testing the mock default game", async function () {
            let txObj = await instance.play(qty/100, {from: alice});
            // Check event
            assert.strictEqual(txObj.logs.length > 1, true, "More than one event expected");
            for (let i = 0; i < txObj.logs.length; i++) {
                let ev = txObj.logs[i];
                //console.log(ev.args);
                if (ev.event === "LogMove") {
                    assert.strictEqual(parseInt(ev.args["move"].toString()) >= 1, true, "Dice was less than 1, was " + parseInt(ev.args["move"].toString()));
                    assert.strictEqual(parseInt(ev.args["move"].toString()) <= 6, true, "Dice was more than 6, was " + parseInt(ev.args["move"].toString()));
                }
                if (ev.event === "LogGame") {
                    assert.strictEqual(ev.args["result"], false, "IA should had won");
                    assert.strictEqual(parseInt(ev.args["balancediff"].toString()), -qty/100, "Removed the wrong amount of balance");
                }
            }
        });
    });

    describe("add balance", function () {

        it("should let anyone to addBalance", async function () {
            let balance = await instance.balances.call(alice);
            assert.strictEqual(balance.toString(), "0", "Balance for alice should be 0 in the beginning");
            let txObj = await instance.addBalance({from: alice, value: qty});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
            balance = await instance.balances.call(alice);
            assert.strictEqual(balance.toString(), qty.toString(), "New balance is not correct");
        });
    });

    describe("withdraw balance", function () {

        it("should let anyone to withdrawBalance", async function () {
            await instance.addBalance({from: alice, value: qty});
            let balanceBefore = await instance.balances.call(alice);
            let txObj = await instance.withdrawBalance({from: alice});
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), balanceBefore.toString(), "Log amount is not correct");
            let balanceAfter = await instance.balances.call(alice);
            assert.strictEqual(balanceAfter.toString(), "0", "Balance for alice should be 0 after withdrawing");
        });
    });

    describe("adding funds to the contract", function() {

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

        it("should not let alice to send balance with addFunds", async function () {
            return await expectedExceptionPromise(function () {
                return instance.addFunds({from: alice, value: qty});
            });
        });

        it("should let the owner send balance with addFunds", async function () {
            let txObj = await instance.addFunds({from: owner, value: qty});
            // Check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], owner, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });
    });

    describe("remove funds from the contract", function() {

        beforeEach("add some funds", async function() {
            await instance.addFunds({from: owner, value: qty});
        });

        it("should not let alice remove funds", async function () {
            return await expectedExceptionPromise(function () {
                return instance.withdrawFunds(qty, {from: alice});
            });
        });

        it("should let the owner remove funds", async function () {
            let txObj = await instance.withdrawFunds(qty, {from: owner});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], owner, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty, "Log amount is not correct");
        });
    });
});
