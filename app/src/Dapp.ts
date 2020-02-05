import { GameManager } from "./GameManager";
import { BoardManager } from "./scenes/board-scene/BoardManager";

const Web3 = require("web3");
const Blockies = require("ethereum-blockies");
const SnakesAndLaddersArtifact = require("../../build/contracts/SnakesAndLadders.json");
const ContractAddress = "0x97bd1590602Fd5dc1beD30755c9c4D6Eb92F55A4";

export class Dapp {

    public static currentInstance: Dapp;

    public web3: any;
    public account: any;
    public contract: any;

    /**
     * Constructor will help the Dapp class to communicate with the game engine
     */
    constructor() {
        
        Dapp.currentInstance = this;
    }

    /**
     * Unlocks the wallet, gets past events of the watcher to fill the right column of the page and
     * finally start the watcher and updates the balance.
     *
     * @returns {Promise<void>}
     */
    public async unlock() {

        // load web3 from metamask
        if (window.ethereum) {
            // from a new generation ethereum browser
            this.web3 = new Web3(window.ethereum);
            try {
                await ethereum.enable();
                console.log("Metamask browser detected.");
            } catch (error) {
                console.log("User denied account access... allow and refresh");
            }
        } else if (window.web3) {
            // load web3 from old dapp browser
            this.web3 = new Web3(window.web3.currentProvider);
            console.log("Legacy dapp browser detected..");
        } else {
            // load web3 from localhost
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("Non-Ethereum browser detected.");
        }

        // load the account
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];

        // save the current contract object
        const networkId = await this.web3.eth.net.getId();
        this.contract = new this.web3.eth.Contract(SnakesAndLaddersArtifact.abi, ContractAddress);

        // start watcher
        let self = this;
        this.web3.eth.getBlockNumber()
            .then(function(latest) {
                self.logPastGames(latest - 6000 * 30);  // last 30 days
                self.startWatcher(latest);
            });

        // this somehow starts the game
        this.getBalance();
    }

    /**
     * Gets the current balance and updates the balance in the UI.
     */
    public getBalance(): void {

        this.contract.methods.balances(this.account).call({ from: this.account }, (e, r) => {
            if (e) {
                console.error("Could not retrieve your balance: " + e);
            } else {
                r = r || "0";
                GameManager.onBalanceAvailable(Web3.utils.fromWei(r));
            }
        });
    }

    /**
     * Adds players funds.
     *
     * @param {string} value
     */
    public addPlayerFunds(value?: string): void {

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

    /**
     * Withdraw player funds when pressing the button, it will withdraw all the funds that he has.
     */
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

    /**
     * Execute a game.
     *
     * @param {number} amount
     */
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

    /**
     * Calls rollDice with a seed and turn to know what was the dice result.
     *
     * @param {string} seed
     * @param {number} turn
     */
    public rollDice(seed: string, turn: number): void {

        let self = this;
        self.contract.methods.randomDice(seed, turn).call()
            .then(function(result) {
                // console.log("DICE RESULT: " + result);
                BoardManager.onDiceResultFetched(parseInt(result));
            });
    }

    /**
     * This will fill the right part of the game with logs of old games.
     *
     * @param fromBlock
     */
    public logPastGames(fromBlock): void {

        let self = this;
        self.contract.getPastEvents('LogGame', { fromBlock: fromBlock, toBlock: 'latest' }, function (error, events) {
            for (let i = 0; i < events.length; i++) {
                self.addNewGameResult(events[i].returnValues["sender"], events[i].returnValues["result"], events[i].returnValues["balancediff"]);
            }
        });
    }

    /**
     * Starts the watcher to check the results of ethereum transactions.
     *
     * @param fromBlock
     */
    public startWatcher(fromBlock): void {

        let self = this;
        self.contract.events.LogGame({ fromBlock: fromBlock })
            .on("data", e => {
                // adds new game to the log if it is not the current player game
                if (e.returnValues["sender"] != this.account) {
                    self.addNewGameResult(e.returnValues["sender"], e.returnValues["result"], e.returnValues["balancediff"]);
                }
                // if the game is from the current user then it will play the game
                if (e.returnValues["sender"] == this.account) {
                    GameManager.onSeedAvailable(e.returnValues["seed"]);
                }
            });
    }

    /**
     * This will add a new result of a player and add it to the right panel.
     *
     * @param sender
     * @param result
     * @param balancediff
     */
    public addNewGameResult(sender, result, balancediff): void {

        let stream_msg = document.createElement("div");
        let eth_blockie = document.createElement("span");
        let eth_address = document.createElement("span");
        let eth_msg = document.createElement("span");
        let eth_balancediff = document.createElement("span");
        let last6 = sender.toLowerCase().substr(sender.length - 6);
        let blockie = Blockies.create({ seed: sender, scale: 3 });
        stream_msg.className = "stream-msg result-" + result;
        eth_blockie.className = "eth-blockie";
        eth_blockie.style.backgroundImage = "url(" + blockie.toDataURL() + ")";
        eth_address.className = "eth-address";
        eth_address.innerHTML = last6;
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
