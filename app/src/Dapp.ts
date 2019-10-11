const Web3 = require("web3");
// const Blockies = require("blockies");
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

        // for testing
        /*
        this.updateBalance();
        this.startWatcher(0); // todo replace 0 for last block found
        this.addAndPlay(1);
        */
        // document.getElementById("eth-blockie-0xaebf4defcaa03eebd1fa491aff1e357073a008c9").appendChild(Blockies.create({seed: '0xaebf4defcaa03eebd1fa491aff1e357073a008c9'}));
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
                console.log("I've got your balance in the contract " + r);
            }
        });
    }

    public addAndPlay(amount) {

        let self = this;
        self.contract.methods.addAndPlay(amount).send({ from: self.account /*, gas: 15000000*/ })
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
                self.addNewResult(e.returnValues["sender"], e.returnValues["turn"], e.returnValues["player"], e.returnValues["move"]);
            });
    }

    public addNewResult(sender, turn, player, move) {

        document.getElementById("LateralTable").innerHTML += "<tr><td>" +
            sender + "</td><td>" +
            turn + "</td><td>" +
            player + "</td><td>" +
            move + "</td></tr>";
    }
}
