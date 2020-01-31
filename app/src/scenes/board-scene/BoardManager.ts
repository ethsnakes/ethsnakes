import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { BoardScene } from "./BoardScene";
import { Chip } from "./Chip";
import { BoardContainer } from "./BoardContainer";

export class BoardManager {
 
    public static init(): void {
       
        GameVars.diceBlocked = false;
        GameVars.currentTurn = null;
        GameVars.turns = 0;
        GameVars.matchOver = false;
        GameVars.paused = false;
    }

    public static startGame(): void {

        // se lanza un dado para saber quien sale
        GameVars.dapp.rollDice(GameVars.seed, GameVars.turns);
    }

    public static rollDice(): void {

        GameVars.dapp.rollDice(GameVars.seed, GameVars.turns);
    }

    public static onDiceResultFetched(value: number): void {

        if (GameVars.turns === 0) {

            if (value === 1 || value === 2) {
                GameVars.currentTurn = GameConstants.PLAYER;
            } else {
                GameVars.currentTurn = GameConstants.BOT;
            }

            BoardScene.currentInstance.startMatch();

        } else {

            GameVars.diceBlocked = true;

            GameVars.diceResult = value;

            BoardScene.currentInstance.rollDice();
        }
       
        GameVars.turns ++;
    }

    public static onTurnMessageRemoved(): void {

        // TODO: aqui tira el bot automaticamente o se le muestra el boton del dado al jugador
        if (GameVars.currentTurn === GameConstants.BOT) {
            
            GameVars.dapp.rollDice(GameVars.seed, GameVars.turns);
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
            BoardManager.matchOver(GameVars.currentTurn);
        } else {

            let boardElement: {in: number, out: number, id: number, anims?: number[]} = null;

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

                    BoardContainer.currentInstance.playLadderFx(boardElement.anims);

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

        GameVars.currentTurn = GameVars.currentTurn === GameConstants.PLAYER ? GameConstants.BOT : GameConstants.PLAYER;

        if (GameVars.currentTurn === GameConstants.BOT) {
            BoardManager.rollDice();
        } else {
            GameVars.diceBlocked = false;
        }

        BoardScene.currentInstance.onTurnChanged();
    }
}
