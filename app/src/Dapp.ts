const Web3 = require("web3");

export class Dapp {
    web3: any;
    defaultAccount: any;

    public async unlock() {
        // Load web3 and unlock it
        if (ethereum) {
            this.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
                console.log("Metamask browser detected.");
            } catch (error) {
                console.log("User denied account access... allow and refresh");
            }
        } else if (web3) {
            this.web3 = new Web3(web3.currentProvider);
            console.log("Legacy dapp browser detected..");
        } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("Non-Ethereum browser detected.");
        }
        console.log("Web3 v" + this.web3.version);
    }

    public async getAccount() {
        let accounts = await this.web3.eth.getAccounts();
        this.defaultAccount = accounts[0];
        console.log(this.defaultAccount);
        alert("your account is " + this.defaultAccount);
    }
}
