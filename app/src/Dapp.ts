import { default as Web3 } from "web3";

export class Dapp {

    public static async start() {
        
        let web3: any;

        // Load web3
        if (ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                console.log("Metamask browser detected.");
            } catch (error) {
                console.log("User denied account access... allow and refresh");
            }
        } 

        console.log("Web3 v" + web3.version);
    }
}
