const BitbetsToken = artifacts.require("SnakesAndLadders.sol");

contract('SnakesAndLadders', (accounts) => {
    const [ owner, alice, bob, carol ] = accounts;
    let SAL;

    beforeEach("prepare", async function() {
        SAL = await SnakesAndLadders.new({from: owner});
    });

    describe("bitbets tokens", function() {
        it('should have 1M BitbetsToken in the first account', async () => {
            const balance = await bitbetsTokenInstance.balanceOf.call(owner);
            assert.equal(balance.valueOf(), 1000000, "1M wasn't in the first account");
        });
    });
});
