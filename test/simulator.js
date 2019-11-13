const SnakesAndLadders = artifacts.require("SnakesAndLaddersMock.sol");
const getTransactionGasUsed = require("../util/get-transaction-cost.js");
const { toWei, toBN } = web3.utils;

contract('SnakesAndLadders Simulation', (accounts) => {
    const [ owner, p1, p2, alice ] = accounts;
    const qty = toWei('0.01', 'ether');
    const simulations = 10000;
    let instance;

    before("running check if the setup is correct to pass the tests", async function() {
        let aliceBalanceBN = toBN(await web3.eth.getBalance(alice));
        let minimum = toBN(toWei('10', 'ether'));
        assert.isTrue(aliceBalanceBN.gte(minimum));
    });

    beforeEach("deploy and prepare", async function() {
        instance = await SnakesAndLadders.new(p1, p2, {from: owner});
    });

    // Test 1 (10.000) - 12/11/2019: winners: 4768, losers: 5232, avg gas: 76097.7172
    // Test 2 (10.000) - 12/11/2019: winners: 4988, losers: 5012, avg gas: 81204.2446 (0.5012)
    // Test 3 (50.000) - 13/11/2019: winners: 24930, losers: 25070, avg gas: 81279.03442 (0.5014)
    // Test 4 (10.000) - 13/11/2019: (ALWAYS STARTS MACHINE), winners: 4938 losers: 5062, avg gas: 81072.6702 (0.5062)

    describe("simulate", function() {

        beforeEach("add some funds", async function() {
            await instance.addBalance({from: alice, value: qty});
        });

        it("simulate " + simulations + " games", async function () {
            this.timeout(10000000000000);
            let winners = 0;
            let losers = 0;
            let totalGas = 0;
            for (let i = 0; i < simulations; i++) {
                await instance.setNonce(i, {from: owner});
                let txObj = await instance.play(qty/10000, {from: alice});
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
