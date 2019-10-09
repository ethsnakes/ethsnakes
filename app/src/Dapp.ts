const Web3 = require("web3");
const SnakesAndLaddersArtifact = require("../../build/contracts/SnakesAndLaddersMock.json");  // TODO change from Mock to good one

export class Dapp {
    web3: any;
    account: any;
    contract: any;

    public async unlock() {
        // load web3 from metamask or new browser
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
                await ethereum.enable();
                console.log("Metamask browser detected.");
            } catch (error) {
                console.log("User denied account access... allow and refresh");
            }
        // load web3 from old dapp browser
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
            console.log("Legacy dapp browser detected..");
        // load web3 from localhost
        } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("Non-Ethereum browser detected.");
        }
        console.log("Web3 v" + this.web3.version);

        this.loadAccount();

        let networkId = await this.web3.eth.net.getId();
        this.contract = new this.web3.eth.Contract(SnakesAndLaddersArtifact.abi, SnakesAndLaddersArtifact.networks[networkId].address);

        this.updateBalance();
    }

    public async loadAccount() {
        let accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        console.log(this.account);
    }

    public updateBalance() {
        this.contract.methods.balances(this.account).call({ from: this.account }, (e, r) => {
            if (e) {
                console.error("Could not retrieve your balance");
                console.log(e);
            } else {
                console.log("I've got your balance");
                console.log(r);
            }
        });
    }
}
