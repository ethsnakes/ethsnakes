import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { BoardScene } from "./BoardScene";
import { GameManager } from "../../GameManager";
import { Chip } from "./Chip";

export class BoardManager {

    private static scene: Phaser.Scene;
   
    public static init(scene: Phaser.Scene): void {

        BoardManager.scene = scene;
       
        GameVars.diceBlocked = false;
        GameVars.turn = Math.random() > .5 ? GameConstants.PLAYER : GameConstants.BOT;
        GameVars.matchOver = false;
        GameVars.paused = false;
    }

    public static startGame(): void {

        if (GameVars.turn === GameConstants.BOT) {
            GameVars.diceBlocked = false;
            BoardManager.rollDice();
        }
    }

    public static resetBoard(): void {
        //
    }

    public static onClickSettings(): void {
        //
    }

    public static chipArrivedToItsPosition(chip: Chip): void {

        if (chip.cellIndex === 100) {
            BoardManager.matchOver(chip.isPlayer);
        } else {

            let outCell = null;

            for (let i = 0; i < GameConstants.BOARD_ELEMENTS.length; i ++) {
                if (GameConstants.BOARD_ELEMENTS[i].in === chip.cellIndex) {
                    outCell = GameConstants.BOARD_ELEMENTS[i].out;
                    break;
                }
            }

            if (outCell === null) {
                BoardManager.changeTurn();
            } else {
                if (outCell > chip.cellIndex) {
                    chip.moveInLadder(outCell);

                    if (chip.isPlayer) {
                        BoardScene.currentInstance.hud.playerClimbsLadder();
                    }
                } else {
                    chip.moveInSnake(outCell);
                }
            }
        }
    }

    public static chipArrivedToItsFinalPosition(): void {

        BoardManager.changeTurn();
    }

    public static rollDice(): void {

        GameVars.diceBlocked = true;

        // GameVars.diceResult = Math.floor(Math.random() * 6 + 1);

        GameVars.diceResult = 2;

        BoardScene.currentInstance.rollDice();
    }

    public static onDiceResultAvailable(): void {

        BoardScene.currentInstance.moveChip();
    }
    
    public static showSettingsLayer(): void {
        
        GameVars.paused = true;

        BoardScene.currentInstance.showSettingsLayer();
    }

    public static hideSettingsLayer(): void {
       
        GameVars.paused = false;

        BoardScene.currentInstance.showSettingsLayer();
    }

    public static matchOver(hasPlayerWon: boolean): void {

        console.log("PARTIDA TERMINADA HA GANADO:", hasPlayerWon ? "el jugador" : "el bot");

        GameVars.matchOver = true;

        BoardScene.currentInstance.matchOver();
    }

    private static changeTurn(): void {

        GameVars.turn = GameVars.turn === GameConstants.PLAYER ? GameConstants.BOT : GameConstants.PLAYER;

        if (GameVars.turn === GameConstants.BOT) {
            BoardManager.rollDice();
        } else {
            GameVars.diceBlocked = false;
        }
    }
}
