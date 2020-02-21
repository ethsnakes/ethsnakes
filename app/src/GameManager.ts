import { GameConstants } from "./GameConstants";
import { GameVars } from "./GameVars";
import { BoardScene } from "./scenes/board-scene/BoardScene";
import { BoardManager } from "./scenes/board-scene/BoardManager";
import { AmountSelectionLayer } from "./scenes/board-scene/layers/AmountSelectionLayer";
import { Dapp } from "./Dapp";
import { AudioManager } from "./AudioManager";

export class GameManager {

    public static init(): void {  

        // para tener un valor cualquiera mientras desarrollamos
        GameVars.bet = 0;
        GameVars.transactionOnCourse = false;
        GameVars.addingFunds = false;
        GameVars.selectingBet = false;
        GameVars.transactionHash = "";
        GameVars.contractBalance = 0;

        GameVars.scaleX = 1;

        const gameAnalytics = require("gameanalytics");
        const gameKey = "6873037a08d50694883ab94fd875263b";
        const secretKey = "7669f7d83362402e790bf9cb7e3878b715499625";

        gameAnalytics.GameAnalytics.initialize(gameKey, secretKey);

        GameManager.readGameData();
    }

    public static readGameData(): void {

        GameManager.getGameStorageData(
            GameConstants.SAVED_GAME_DATA_KEY,
            function (gameData: string): void {

                if (gameData) {
                    GameVars.gameData = JSON.parse(gameData);
                } else {
                    GameVars.gameData = {
                        muted: false
                    };
                }

                GameManager.startGame();
            }
        );
    }

    public static onGameAssetsLoaded(): void {

        AudioManager.init();

        GameVars.dapp = new Dapp();
        GameVars.dapp.unlock();

        GameManager.enterBoardScene();
    }

    public static onMetamaskBalanceAvailable(metamaskBalance: string): void {

        GameVars.metamaskBalance = Number(metamaskBalance);

        if (GameVars.addingFunds) {
            BoardScene.currentInstance.activateBetButtons();
        }
    }

    public static onContractBalanceAvailable(contractBalance: string): void {

        GameVars.contractBalance = Number(contractBalance);

        if (GameVars.selectingBet) {
            BoardScene.currentInstance.activateBetButtons();
        }
    }

    public static onBalanceAvailable(balance: string): void {

        GameVars.balance = Number(balance);

        if (GameVars.balance < 0.01) {
            GameVars.balance = 0;
        }

        GameVars.transactionOnCourse = false;
        GameVars.addingFunds = false;
        GameVars.selectingBet = false;

        BoardScene.currentInstance.onBalanceAvailable();
    }

    public static setCurrentScene(scene: Phaser.Scene): void {

        GameVars.currentScene = scene;
    }

    public static onAccountLoaded(): void {

       Dapp.currentInstance.getBalance();
    }

    public static enterBoardScene(): void {

        GameVars.currentScene.scene.start("BoardScene");
    }

    public static play(): void {

        GameVars.selectingBet = true;

        GameVars.dapp.getContractBalance();

        BoardScene.currentInstance.showBetSelectionLayer();
    }

    public static replay(): void {

        Dapp.currentInstance.getBalance();

        GameManager.enterBoardScene();
    }

    public static onPlayerConfirmedAmount(value: number): void {

        GameVars.transactionOnCourse = true;
        GameVars.bet = value;

        if (GameVars.addingFunds) {

            GameVars.dapp.addPlayerFunds(value.toString());

        } else {

            GameVars.dapp.play(value);
        }
    }

    public static onTransactionHashObtained(transactionHash: string): void {

        GameVars.transactionHash = transactionHash;

        BoardScene.currentInstance.showWaitingLayer();
    }

    public static onTransactionConfirmed(): void {

        GameVars.transactionOnCourse = false;

        // le restamos la apuesta al balance
        GameVars.balance -= GameVars.bet;
        GameVars.balance = Math.floor(GameVars.balance * 100) / 100;

        BoardScene.currentInstance.onTransactionExecuted();
    }

    public static onSeedAvailable(seed: string): void {

        GameVars.seed = seed;

        console.log("seed es:", GameVars.seed);

        BoardManager.startGame();
    }

    public static matchOver(): void {
        
        BoardScene.currentInstance.matchOver();
    }

    public static onClickAddFunds(): void {

        GameVars.addingFunds = true;

        GameVars.dapp.getMetamaskBalance();

        BoardScene.currentInstance.showFundsAmountToAddLayer();
    }

    public static hideAmountSelectionLayer(): void {

        GameVars.addingFunds = false;
        GameVars.selectingBet = false;

        BoardScene.currentInstance.hideAmountSelectionLayer();
    }

    public static onBetSelected(value: number): void {

        GameVars.bet = value;

        AmountSelectionLayer.currentInstance.betSelected(value);
    }

    public static withdrawFunds(): void {

        GameVars.transactionOnCourse = true;

        GameVars.dapp.withdrawPlayerFunds();
    }

    public static playerCancelledMetamaskAction(): void {

        if (GameVars.addingFunds || GameVars.selectingBet) {
            GameManager.hideAmountSelectionLayer();
        } 
    }

    public static writeGameData(): void {

        GameManager.setGameStorageData(
            GameConstants.SAVED_GAME_DATA_KEY,
            GameVars.gameData,
            function (): void {
                GameManager.log("game data successfully saved");
            }
        );
    }

    public static log(text: string, error?: Error): void {

        if (!GameConstants.VERBOSE) {
            return;
        }

        if (error) {
            console.error(text + ":", error);
        } else {
            console.log(text);
        }
    }

    private static startGame(): void {

        GameVars.currentScene.scene.start("PreloadScene");
    }

    private static getGameStorageData(key: string, successCb: Function): void {

        const gameDataStr = localStorage.getItem(key);
        successCb(gameDataStr);
    }

    private static setGameStorageData(key: string, value: any, successCb: Function): void {

        localStorage.setItem(key, JSON.stringify(value));
        successCb();
    }
}
