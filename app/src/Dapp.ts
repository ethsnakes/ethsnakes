const Web3 = require("web3");
// https://github.com/ethereum/blockies
const Blockies = require("ethereum-blockies");
const SnakesAndLaddersArtifact = require("../../build/contracts/SnakesAndLaddersMock.json");  // TODO change from Mock to good one

export class Dapp {
    web3: any;
    account: any;
    contract: any;

    public async unlock() {

        let self = this;
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

        this.startWatcher(0);

        // for testing
        this.addAndPlay(20, 1);
    }

    public async loadAccount() {

        let accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
    }

    public logBalance() {

        this.contract.methods.balances(this.account).call({ from: this.account }, (e, r) => {

            if (e) {
                console.error("Could not retrieve your balance");
                console.log(e);
            } else {
                console.log("Your balance in Wei (" + this.account + "): " + r);
            }
        });
    }


    public addAndPlay(value, amount) {

        let self = this;
        self.contract.methods.addAndPlay(amount).send({ from: self.account, value: value, gas: 1000000 })
            .on("transactionHash", (transactionHash) => console.log("Transaction " + transactionHash))
            .on("confirmation", (confirmationNumber, receipt) => {
                if (receipt.status === true && confirmationNumber === 1) {
                    console.log("Transaction confirmed")
                }
            })
            .on("error", error => console.error(error));
    }

    public startWatcher(fromBlock) {

        let self = this;
        self.contract.events.LogGame({ fromBlock: fromBlock })
            .on("data", e => {
                self.addNewGameResult(e.returnValues["sender"], e.returnValues["result"], e.returnValues["balancediff"]);
            });
    }

    public addNewGameResult(sender, result, balancediff) {

        let stream_msg = document.createElement("div");
        let eth_blockie = document.createElement("span");
        let eth_address = document.createElement("span");
        let eth_balancediff = document.createElement("span");
        let blockie = Blockies.create({ seed: this.account, color: "#dfe", bgcolor: "#a71" });
        stream_msg.className = 'stream-msg result-' + result;
        eth_blockie.className = 'eth-blockie';
        eth_blockie.style.backgroundImage = 'url(' + blockie.toDataURL() + ')';
        eth_address.className = 'eth-address';
        eth_address.innerHTML = sender.toLowerCase();
        eth_balancediff.innerHTML = balancediff;
        eth_balancediff.className = 'eth-balancediff';
        stream_msg.appendChild(eth_blockie);
        stream_msg.appendChild(eth_address);
        stream_msg.appendChild(eth_balancediff);
        document.getElementById("stream").appendChild(stream_msg);
    }
}
