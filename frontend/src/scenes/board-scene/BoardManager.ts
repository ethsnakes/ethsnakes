import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { BoardScene } from "./BoardScene";
import { GameManager } from "../../GameManager";

export class BoardManager {

    private static scene: Phaser.Scene;
    private static gameStarted: boolean;

    public static init(scene: Phaser.Scene): void {

        BoardManager.scene = scene;
        BoardManager.gameStarted = false;

        GameVars.turn = GameConstants.PLAYER;

        GameVars.paused = false;
    }

    public static onClickSettings(): void {
        //
    }

    public static rollDice(): void {

        GameVars.diceResult = Math.floor(Math.random() * 6 + 1);

        BoardScene.currentInstance.rollDice();
    }

    public static onDiceResultAvailable(): void {

        BoardScene.currentInstance.moveChip();

        // cambiamos el turno
        GameVars.turn = GameVars.turn === GameConstants.PLAYER ? GameConstants.BOT : GameConstants.PLAYER;
    }
    
    public static showSettingsLayer(): void {
        
        GameVars.paused = true;

        BoardScene.currentInstance.showSettingsLayer();
    }

    public static hideSettingsLayer(): void {
       
        GameVars.paused = false;

        BoardScene.currentInstance.showSettingsLayer();
    }

    private static start(p: { r: number, c: number }): void {
        //
    }

    private static matchOver(won: boolean, p: {r: number, c: number}): void {

        GameVars.matchOver = true;

        if (won) {
            GameManager.matchOver();
        }

        BoardScene.currentInstance.matchOver(won, p);
    }
}
