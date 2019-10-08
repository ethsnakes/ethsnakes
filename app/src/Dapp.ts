import { default as Web3 } from "web3";

let web3;

export class Dapp {

    public async start(): {
        let self = this;

        // Load web3
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                console.log("Metamask browser detected.");
            } catch (error) {
                console.log("User denied account access... allow and refresh");
            }
        } else if (window.web3) {
            web3 = new Web3(web3.currentProvider);
            console.log("Legacy dapp browser detected..");
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            console.log("Non-Ethereum browser detected.");
        }
        console.log("Web3 v" + web3.version);
    }
}
