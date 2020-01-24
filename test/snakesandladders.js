const SnakesAndLadders = artifacts.require("SnakesAndLaddersMock.sol");
const getTransactionGasUsed = require("../util/get-transaction-cost.js");
const expectedExceptionPromise = require("../util/expected-exception-promise.js");
const { toWei, toBN } = web3.utils;

contract('SnakesAndLadders', (accounts) => {
    const [ carol, p1, p2, alice, bob ] = accounts;
    let instance;
    const qty1 = toWei('0.01', 'ether');
    const qtyhalf = toWei('0.005', 'ether');
    const qty2 = toWei('0.02', 'ether');
    const qty3 = toWei('0.03', 'ether');

    before("running check if the setup is correct to pass the tests", async function() {
        let aliceBalanceBN = toBN(await web3.eth.getBalance(alice));
        let bobBalanceBN = toBN(await web3.eth.getBalance(bob));
        let minimum = toBN(toWei('10', 'ether'));
        assert.isTrue(aliceBalanceBN.gte(minimum));
        assert.isTrue(bobBalanceBN.gte(minimum));
    });

    beforeEach("deploy before each describe", async function() {
        instance = await SnakesAndLadders.new(p1, p2, {from: carol});
    });

    describe("add player funds", function() {

        it("should start with 0 funds", async function () {
            let b1 = await instance.balances.call(alice);
            assert.strictEqual(b1.toString(), "0", "Initial balance of alice should be 0");
            let b2 = await instance.balances.call(carol);
            assert.strictEqual(b2.toString(), "0", "Initial balance of carol should be 0");
        });

        it("should not let add 0 funds", async function () {
            return await expectedExceptionPromise(function () {
                return instance.addPlayerFunds({from: alice, value: 0});
            });
        });

        it("should let alice add funds twice", async function () {
            let txObj = await instance.addPlayerFunds({from: alice, value: qty1});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty1.toString(), "Log amount is not correct");
            let newBalance = await instance.balances.call(alice);
            assert.strictEqual(newBalance.toString(), qty1.toString(), "Balance for alice should be the added balance");
            // add balance for a second time
            let txObj2 = await instance.addPlayerFunds({from: alice, value: qty2});
            assert.strictEqual(txObj2.logs.length, 1, "Only one event is expected");
            let args2 = txObj2.logs[0].args;
            assert.strictEqual(args2['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args2['amount'].toString(), qty2.toString(), "Log amount is not correct");
            let newBalance2 = await instance.balances.call(alice);
            assert.strictEqual(newBalance2.toString(), qty3.toString(), "New balance should be the sum of the two balances added");
        });

        it("should let carol add funds", async function () {
            let txObj = await instance.addPlayerFunds({from: carol, value: qty1});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], carol, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty1.toString(), "Log amount is not correct");
        });
    });

    describe("withdraw funds", function () {

        it("should let anyone to withdrawPlayerFunds", async function () {
            await instance.addPlayerFunds({from: alice, value: qty1});
            let balanceBefore = await instance.balances.call(alice);
            let txObj = await instance.withdrawPlayerFunds({from: alice});
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), balanceBefore.toString(), "Log amount is not correct");
            let balanceAfter = await instance.balances.call(alice);
            assert.strictEqual(balanceAfter.toString(), "0", "Balance for alice should be 0 after withdrawing");
        });

        it("should not let withdraw if there is no funds", async function () {
            return await expectedExceptionPromise(function () {
                return instance.withdrawPlayerFunds({from: alice});
            });
        });
    });

    describe("play the game", function() {

        beforeEach("add some funds to alice", async function() {
            await instance.addPlayerFunds({from: alice, value: qty1});
        });

        it("testing the mocked default game (winner)", async function () {
            let betAmount = qty1/100;
            await instance.setNonce(3, {from: carol});
            let txObj = await instance.play(qty1/100, {from: alice});
            console.log("        gas used: " + getTransactionGasUsed(txObj));
            // check events
            assert.strictEqual(txObj.logs.length, 1, "Only one event expected");
            let ev = txObj.logs[0];
            assert.strictEqual(ev.event, "LogGame", "Event should be LogGame");
            assert.strictEqual(ev.args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(ev.args['result'], true, "Game should be favorable to Player");
            assert.strictEqual(ev.args['balancediff'].toString(), betAmount.toString(), "Log balancediff is not correct");
            assert.strictEqual(ev.args['seed'].toString() !== "", true, "Seed cannot be empty");
            // check resulting balance
            let newBalance = await instance.balances.call(alice);
            assert.strictEqual(newBalance.toString(), (parseInt(qty1) + betAmount).toString(), "New balance should be the amount plus the bet");
        });

        it("testing the mocked default game (loser)", async function () {
            let betAmount = qty1/100;
            await instance.setNonce(2, {from: carol});  // setting nonce 2, which is a loser game
            let txObj = await instance.play(qty1/100, {from: alice});
            // check events
            assert.strictEqual(txObj.logs.length, 1, "Only one event expected");
            let ev = txObj.logs[0];
            assert.strictEqual(ev.event, "LogGame", "Event should be LogGame");
            assert.strictEqual(ev.args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(ev.args['result'], false, "Game should be favorable to AI");
            assert.strictEqual(ev.args['balancediff'].toString(), (-betAmount).toString(), "Log balancediff is not correct");
            assert.strictEqual(ev.args['seed'].toString() !== "", true, "Seed cannot be empty");
            // check resulting balance
            let newBalance = await instance.balances.call(alice);
            assert.strictEqual(newBalance.toString(), (parseInt(qty1) - betAmount).toString(), "New balance should be the amount minus the bet");
        });

        it("cannot play a game without betting", async function () {
            return await expectedExceptionPromise(function () {
                return instance.play(0, {from: alice});
            });
        });

        it("cannot play if balance is 0", async function () {
            return await expectedExceptionPromise(function () {
                return instance.play(qty1, {from: bob});
            });
        });

        it("cannot play if doesn't have enough balance to play", async function () {
            await instance.addPlayerFunds({from: alice, value: qty1});
            return await expectedExceptionPromise(function () {
                return instance.play(qty2, {from: bob});
            });
        });

        it("cannot bet with equal or more than 1/10 of the contract balance", async function () {
            return await expectedExceptionPromise(function () {
                return instance.play(qty1/10, {from: alice});
            });
        });

        it("can play if bets less than 1/10 of the contract balance", async function () {
            await instance.setNonce(3, {from: carol});
            let betAmount = parseInt(qty1)/10 - 1;
            let txObj = await instance.play(betAmount, {from: alice});
            // check events
            assert.strictEqual(txObj.logs.length, 1, "Only one event expected");
            let ev = txObj.logs[0];
            assert.strictEqual(ev.event, "LogGame", "Event should be LogGame");
            assert.strictEqual(ev.args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(ev.args['result'], true, "Game should be favorable to Player");
            assert.strictEqual(ev.args['balancediff'].toString(), betAmount.toString(), "Log balancediff is not correct");
            assert.strictEqual(ev.args['seed'].toString() !== "", true, "Seed cannot be empty");
        });

        it("cannot bet more than 1 eth", async function () {
            await instance.addPlayerFunds({from: bob, value: toWei('11', 'ether')});
            return await expectedExceptionPromise(function () {
                return instance.play(toWei('1.00001', 'ether'), {from: bob});
            });
        });
    });

    describe("adding funds to the contract", function() {

        it("should not let alice send eth directly", async function () {
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: alice, value: qty1});
            });
        });

        it("should not let carol send eth directly", async function () {
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: carol, value: qty1});
            });
        });

        it("should let anyone add funds with addFunds", async function () {
            // contract starts with 0 amount
            let oldBalance = await web3.eth.getBalance(instance.address);
            assert.strictEqual(oldBalance.toString(), "0", "Contract should start with 0 eth");
            // add funds
            let txObj = await instance.addFunds({from: bob, value: qty1});
            // check event
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], bob, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty1, "Log amount is not correct");
            // check that contract got the value
            let newBalance = await web3.eth.getBalance(instance.address);
            assert.strictEqual(newBalance.toString(), qty1.toString(), "New amount in the contract is not correct");
        });

        it("should not let anyone add 0 funds", async function () {
            return await expectedExceptionPromise(function () {
                return instance.sendTransaction({from: p1, value: 0});
            });
        });
    });

    describe("payout the two payout addresses", function() {

        beforeEach("add some funds", async function() {
            await instance.addFunds({from: carol, value: qty1});
        });

        it("should let p1 call the payout", async function () {
            let txObj = await instance.payout(qty1, {from: p1});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], p1, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty1, "Log amount is not correct");
            // check resulting balance
            let balance1 = await instance.balances.call(p1);
            let balance2 = await instance.balances.call(p2);
            assert.strictEqual(balance1.toString(), qtyhalf.toString(), "Payout was not given correctly for p1");
            assert.strictEqual(balance2.toString(), qtyhalf.toString(), "Payout was not given correctly for p2");
        });

        it("should let p2 call the payout", async function () {
            let txObj = await instance.payout(qty1, {from: p2});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], p2, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty1, "Log amount is not correct");
            // check resulting balance
            let balance1 = await instance.balances.call(p1);
            let balance2 = await instance.balances.call(p2);
            assert.strictEqual(balance1.toString(), qtyhalf.toString(), "Payout was not given correctly for p1");
            assert.strictEqual(balance2.toString(), qtyhalf.toString(), "Payout was not given correctly for p2");
        });

        it("cannot payout if there is not enough funds to withdraw", async function () {
            return await expectedExceptionPromise(function () {
                return instance.payout(qty2, {from: carol});
            });
        });

        it("cannot payout if there is not enough free funds to withdraw", async function () {
            // add balance which is "locked"
            let txObj = await instance.addPlayerFunds({from: alice, value: qty3});
            assert.strictEqual(txObj.logs.length, 1, "Only one event is expected");
            let args = txObj.logs[0].args;
            assert.strictEqual(args['sender'], alice, "Log sender is not correct");
            assert.strictEqual(args['amount'].toString(), qty3.toString(), "Log amount is not correct");
            // expect a payout that is bigger than free funds but less than total funds
            return await expectedExceptionPromise(function () {
                return instance.payout(qty2, {from: carol});
            });
        });

        it("should expect error if qty is 0", async function () {
            return await expectedExceptionPromise(function () {
                return instance.payout(0, {from: alice});
            });
        });

        it("should expect error if qty is odd", async function () {
            return await expectedExceptionPromise(function () {
                return instance.payout(3, {from: alice});
            });
        });

        it("should not let alice call payout", async function () {
            return await expectedExceptionPromise(function () {
                return instance.payout(qty1, {from: alice});
            });
        });
    });

    describe("random and randomdice", function () {

        it("should get a random string and check a couple of different dices", async function () {
            let randomString = await instance.random({from: alice});
            assert.strictEqual(randomString.toString() !== "", true, "Random seed is empty");
            let dice1 = await instance.randomDice(randomString, 0, {from: alice});
            let dice2 = await instance.randomDice(randomString, 1, {from: alice});
            let dice3 = await instance.randomDice(randomString, 2, {from: alice});
            let dice4 = await instance.randomDice(randomString, 3, {from: alice});
            let dice5 = await instance.randomDice(randomString, 4, {from: alice});
            let dice6 = await instance.randomDice(randomString, 5, {from: alice});
            assert.strictEqual(dice1 !== dice2 || dice1 !== dice3 || dice1 !== dice4 || dice1 !== dice5 || dice1 !== dice6, true, "All dices are the same");
            assert.strictEqual(dice1 >= 1 && dice1 <= 6, true, "Dice1 is not between 1 and 6");
            assert.strictEqual(dice2 >= 1 && dice2 <= 6, true, "Dice2 is not between 1 and 6");
            assert.strictEqual(dice3 >= 1 && dice3 <= 6, true, "Dice3 is not between 1 and 6");
            assert.strictEqual(dice4 >= 1 && dice4 <= 6, true, "Dice4 is not between 1 and 6");
            assert.strictEqual(dice5 >= 1 && dice5 <= 6, true, "Dice5 is not between 1 and 6");
            assert.strictEqual(dice6 >= 1 && dice6 <= 6, true, "Dice6 is not between 1 and 6");
        });
    });
});
