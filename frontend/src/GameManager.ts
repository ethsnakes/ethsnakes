import { GameConstants } from "./GameConstants";
import { GameVars } from "./GameVars";

export class GameManager {

    public static init(): void {  


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

    public static setCurrentScene(scene: Phaser.Scene): void {

        GameVars.currentScene = scene;
    }

    public static onGameAssetsLoaded(): void {

        GameManager.enterBoardScene();
    }

    public static enterBoardScene(difficulty?: string): void {

        GameVars.currentScene.scene.start("BoardScene");
    }

    public static reset(): void {

        GameVars.currentScene.scene.start("BoardScene");
    }

    public static matchOver(): void {
        //
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
