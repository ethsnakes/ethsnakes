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
        GameVars.transactionHash = "";

        if (GameVars.currentScene.sys.game.device.os.desktop) {

            GameVars.scaleX = 1;

        } else {

            GameVars.currentScene.game.scale.displaySize = GameVars.currentScene.game.scale.parentSize;
            GameVars.currentScene.game.scale.refresh();  

            const aspectRatio = window.innerWidth / window.innerHeight;
            GameVars.scaleX = (GameConstants.GAME_WIDTH / GameConstants.GAME_HEIGHT) / aspectRatio;
        }

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

    public static onBalanceAvailable(balance: string): void {

        GameVars.balance = Number(balance);

        GameVars.transactionOnCourse = false;

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

        BoardScene.currentInstance.showSelectBetLayer();
    }

    public static replay(): void {

        Dapp.currentInstance.getBalance();

        GameManager.enterBoardScene();
    }

    public static onPlayerSelectedAmount(value: number): void {

        GameVars.transactionOnCourse = true;

        if (GameVars.addingFunds) {

            GameVars.addingFunds = false;
            GameVars.dapp.addPlayerFunds(value.toString());

        } else {

            BoardScene.currentInstance.onPlayerSelectedBet();
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
        
        if (GameVars.winner === GameConstants.PLAYER) {
            GameVars.balance += 2 * GameVars.bet;
            GameVars.balance = Math.floor(GameVars.balance * 100) / 100;
        }
    }

    public static onClickAddFunds(): void {

        GameVars.addingFunds = true;

        BoardScene.currentInstance.showFundsAmountToAddLayer();
    }

    public static onBetSelected(value: number): void {

        GameVars.bet = value;

        AmountSelectionLayer.currentInstance.betSelected(value);
    }

    public static withdrawFunds(): void {

        GameVars.dapp.withdrawPlayerFunds();
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
