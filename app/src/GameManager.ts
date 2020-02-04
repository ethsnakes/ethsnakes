import { GameConstants } from "./GameConstants";
import { GameVars } from "./GameVars";
import { BoardScene } from "./scenes/board-scene/BoardScene";
import { BoardManager } from "./scenes/board-scene/BoardManager";
import { SelectBetLayer } from "./scenes/board-scene/layers/SelectBetLayer";
import { Dapp } from "./Dapp";
import { AudioManager } from "./AudioManager";

export class GameManager {

    public static init(): void {  

        // para tener un valor cualquiera mientras desarrollamos
        GameVars.bet = 0;
        GameVars.transactionOnCourse = false;

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

        BoardManager.resetBoard();
    
        BoardScene.currentInstance.showSelectBetLayer();
    }

    public static replay(): void {

        Dapp.currentInstance.getBalance();

        GameManager.enterBoardScene();
    }

    public static onPlayerSelectedBet(value: number): void {

        GameVars.transactionOnCourse = true;

        BoardScene.currentInstance.onPlayerSelectedBet();

        GameVars.dapp.play(value);
    }

    public static onTransactionConfirmed(): void {

        GameVars.transactionOnCourse = false;

        BoardScene.currentInstance.onTransactionExecuted();
    }

    public static onSeedAvailable(seed: string): void {

        GameVars.seed = seed;

        console.log("seed es:", GameVars.seed);

        BoardManager.startGame();
    }

    public static matchOver(): void {
        //
    }

    public static addFunds(): void {

        GameVars.transactionOnCourse = true;
        
        GameVars.dapp.addPlayerFunds();
    }

    public static onBetSelected(value: number): void {

        GameVars.bet = value;

        SelectBetLayer.currentInstance.betSelected(value);
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
