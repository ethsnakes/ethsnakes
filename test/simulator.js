const SnakesAndLadders = artifacts.require("SnakesAndLadders.sol");
const getTransactionGasUsed = require("../util/get-transaction-cost.js");
const { toWei, toBN, fromAscii } = web3.utils;

contract('SnakesAndLadders Simulation', (accounts) => {
    const [ owner, p1, p2, alice, bob, carol ] = accounts;
    let instance;
    const qty = toWei('0.01', 'ether');
    const qtyBN = toBN(qty);
    const simulations = 10;

    before("running check if the setup is correct to pass the tests", async function() {
        let aliceBalanceBN = toBN(await web3.eth.getBalance(alice));
        let minimum = toBN(toWei('1', 'ether'));
        assert.isTrue(aliceBalanceBN.gte(minimum));
    });

    beforeEach("deploy and prepare", async function() {
        instance = await SnakesAndLadders.new(p1, p2, {from: owner});
    });

    // Test 1 - (10.000): winners: 4971, losers: 5029

    describe("simulate", function() {

        beforeEach("add some funds", async function() {
            await instance.addBalance({from: alice, value: qty});
        });

        it("simulate " + simulations + " games", async function () {
            this.timeout(1000000000000);
            let winners = 0;
            let losers = 0;
            let totalGas = 0;
            for (let i = 0; i < simulations; i++) {
                let txObj = await instance.play(qty/1000, {from: alice});
                totalGas += getTransactionGasUsed(txObj);
                let ev = txObj.logs[txObj.logs.length - 1];
                if (ev.event === "LogGame") {
                    if (ev.args["result"]) {
                        winners++;
                    } else {
                        losers++;
                    }
                }
            }
            console.log("        winners: " + winners, "losers: " + losers);
            console.log("        avg gas: " + totalGas/simulations)
        });
    });
});
