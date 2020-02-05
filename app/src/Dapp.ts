import { GameManager } from "./GameManager";
import { BoardManager } from "./scenes/board-scene/BoardManager";

const Web3 = require("web3");
const Blockies = require("ethereum-blockies");
//const SnakesAndLaddersArtifact = require("../../build/contracts/SnakesAndLaddersMock.json");
const SnakesAndLaddersArtifact = require("../../build/contracts/SnakesAndLadders.json");
const ContractAddress = "0x97bd1590602Fd5dc1beD30755c9c4D6Eb92F55A4";

export class Dapp {

    public static currentInstance: Dapp;

    public web3: any;
    public account: any;
    public contract: any;

    constructor() {
        
        Dapp.currentInstance = this;
    }

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

        const networkId = await this.web3.eth.net.getId();
        this.contract = new this.web3.eth.Contract(SnakesAndLaddersArtifact.abi, ContractAddress);

        const latest = await web3.eth.getBlockNumber();
        this.startWatcher(latest);

        // for testing
        // const value = Web3.utils.toWei("0.1", "ether");
        // const amount = Web3.utils.toWei("0.001", "ether");
        this.getBalance();
    }

    public async loadAccount() {

        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];

        console.log("account:", this.account);
    }

    public getBalance(): void {

        this.contract.methods.balances(this.account).call({ from: this.account }, (e, r) => {

            if (e) {
                console.error("Could not retrieve your balance");
                console.log(e);
            } else {

                r = r || "0";
                GameManager.onBalanceAvailable(Web3.utils.fromWei(r));
            }
        });
    }

    public addPlayerFunds(value?: string): void {

        value = value || "0.2";

        let self = this;
        self.contract.methods.addPlayerFunds().send({ from: self.account, value: Web3.utils.toWei(value, "ether")})
            .on("transactionHash", function(transactionHash): void {
                console.log("Transaction " + transactionHash);
                GameManager.onTransactionHashObtained(transactionHash);
            })
            .on("receipt", function(receipt) {
                self.getBalance();
            })
            .on("error", function(error) {

                console.warn(error);
                GameManager.playerCancelledMetamaskAction();
            });
    }

    public withdrawPlayerFunds(): void {

        let self = this;
        self.contract.methods.withdrawPlayerFunds().send({ from: self.account })
            .on("transactionHash", (transactionHash) => console.log("Transaction " + transactionHash))
            .on("receipt", function(receipt) {
                self.getBalance();
            })
            .on("error", function(error) {

                // TODO aqui es el callback de quan cancela el metamask al fer withdraw
                console.error(error);
            });
    }

    public play(amount: number): void {

        amount = Web3.utils.toWei(amount.toString(), "ether");

        let self = this;
        let gasPrice = Web3.utils.toWei("10", "gwei");
        self.contract.methods.play(amount).send({ from: self.account, gas: 500000, gasPrice: gasPrice })
            .on("transactionHash", function(transactionHash) {

                console.log("Transaction " + transactionHash);
                GameManager.onTransactionHashObtained(transactionHash);
            })
            .on("receipt", function(receipt) {

                GameManager.onTransactionConfirmed();
            })
            .on("error", function(error) {

                console.warn(error);
                GameManager.playerCancelledMetamaskAction();
            });
    }

    public startWatcher(fromBlock): void {

        let self = this;
        self.contract.events.LogGame({ fromBlock: fromBlock })
            .on("data", e => {

                self.addNewGameResult(e.returnValues["sender"], e.returnValues["result"], e.returnValues["balancediff"]);

                if (e.returnValues["sender"] == this.account) {
                    GameManager.onSeedAvailable(e.returnValues["seed"]);
                }
            });
    }

    public rollDice(seed: string, turn: number): void {

        let self = this;
        self.contract.methods.randomDice(seed, turn).call()
            .then(function(result) {
                // console.log("DICE RESULT: " + result);
                BoardManager.onDiceResultFetched(parseInt(result));
            });
    }

    public addNewGameResult(sender, result, balancediff): void {

        if (sender == this.account) {
             return;
        }
        let stream_msg = document.createElement("div");
        let eth_blockie = document.createElement("span");
        let eth_address = document.createElement("span");
        let eth_msg = document.createElement("span");
        let eth_balancediff = document.createElement("span");
        let blockie = Blockies.create({ seed: this.account, color: "#019DB0", bgcolor: "#CBE942", scale: 3 });
        stream_msg.className = "stream-msg result-" + result;
        eth_blockie.className = "eth-blockie";
        eth_blockie.style.backgroundImage = "url(" + blockie.toDataURL() + ")";
        eth_address.className = "eth-address";
        eth_address.innerHTML = sender.toLowerCase().substr(sender.length - 6);
        eth_msg.className = "eth-msg";
        eth_msg.innerHTML = result ? "Winner!" : "Loser";
        eth_balancediff.className = "eth-balancediff";
        eth_balancediff.innerHTML = Web3.utils.fromWei(balancediff, "ether") + " ETH";
        stream_msg.appendChild(eth_blockie);
        stream_msg.appendChild(eth_address);
        stream_msg.appendChild(eth_msg);
        stream_msg.appendChild(eth_balancediff);
        // remove last elements
        document.getElementById("stream-content").insertBefore(stream_msg, document.getElementById("stream-content").firstChild);
        if (document.getElementById("stream-content").childElementCount > 20) {
            document.getElementById("stream-content").removeChild(document.getElementById("stream-content").lastChild);
        }
    }
}
