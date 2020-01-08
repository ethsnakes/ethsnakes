import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { BoardScene } from "./BoardScene";
import { Chip } from "./Chip";
import { BoardContainer } from "./BoardContainer";

export class BoardManager {
 
    public static init(): void {
       
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

    public static   chipArrivedToItsPosition(chip: Chip): void {

        if (chip.cellIndex === 100) {
            BoardManager.matchOver(GameVars.turn);
        } else {

            let boardElement: {in: number, out: number, id: number} = null;

            for (let i = 0; i < GameConstants.BOARD_ELEMENTS.length; i ++) {
                if (GameConstants.BOARD_ELEMENTS[i].in === chip.cellIndex) {
                    boardElement = GameConstants.BOARD_ELEMENTS[i];
                    break;
                }
            }

            if (boardElement === null) {

                BoardManager.changeTurn();

            } else {
                if (boardElement.out > chip.cellIndex) {
                    chip.moveInLadder(boardElement.out);

                    if (chip.isPlayer) {
                        BoardScene.currentInstance.hud.playerClimbsLadder();
                    }
                } else {
                    BoardContainer.currentInstance.snakeEatsChip(chip, boardElement);
                }
            }
        }
    }

    public static chipArrivedToItsFinalPosition(): void {

        BoardManager.changeTurn();
    }

    public static rollDice(): void {

        GameVars.diceBlocked = true;

        GameVars.diceResult = Math.floor(Math.random() * 6 + 1);

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

    public static matchOver(winner: string): void {

        GameVars.matchOver = true;

        GameVars.winner = winner;

        BoardScene.currentInstance.matchOver();
    }

    private static changeTurn(): void {

        GameVars.turn = GameVars.turn === GameConstants.PLAYER ? GameConstants.BOT : GameConstants.PLAYER;

        if (GameVars.turn === GameConstants.BOT) {
            BoardManager.rollDice();
        } else {
            GameVars.diceBlocked = false;
        }

        BoardScene.currentInstance.onTurnChanged();
    }
}
