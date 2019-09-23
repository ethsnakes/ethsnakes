import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { BoardScene } from "./BoardScene";
import { BoardContainer } from "./BoardContainer";
import { GameManager } from "../../GameManager";

export class BoardManager {

    private static scene: Phaser.Scene;
    private static gameStarted: boolean;

    public static init(scene: Phaser.Scene): void {

        BoardManager.scene = scene;
        BoardManager.gameStarted = false;

        GameVars.paused = false;
        GameVars.time = 0;
        GameVars.matchOver = false;
        GameVars.flaggedCells = 0;
    }
    
    public static showSettingsLayer(): void {
        
        GameVars.paused = true;

        BoardScene.currentInstance.showSettingsLayer();
    }

    public static hideSettingsLayer(): void {
       
        GameVars.paused = false;

        BoardScene.currentInstance.showSettingsLayer();
    }

    public static onCellUp(p: { r: number, c: number }, deltaTime: number, rightMouse: boolean): void {

        if (!BoardManager.gameStarted) {
            BoardManager.start(p);
        }

        if (deltaTime > 500 || rightMouse) {

            GameVars.board.cycleCellFlag(p.c, p.r);
            GameVars.grid = GameVars.board.grid();

            // HACEMOS ESTO PORQUE ESTA LIBRERIA TIENE 3 ESTADOS PARA EL FLAG EN LUGAR DE 2
            if (GameVars.grid[p.r][p.c].flag === 2) {
                GameVars.board.cycleCellFlag(p.c, p.r);
                GameVars.grid = GameVars.board.grid();
            }

            if (GameVars.grid[p.r][p.c].flag === 1) {

                BoardContainer.currentInstance.flagCell(p);
                GameVars.flaggedCells ++;

                if (GameVars.flaggedCells === GameVars.mines) {

                    const state = GameVars.board.state();

                    if (state === GameConstants.BOARD_STATE_LOST || state === GameConstants.BOARD_STATE_WON) {
                        BoardManager.matchOver(state === GameConstants.BOARD_STATE_WON, p);
                    }
                }

            } else {

                BoardContainer.currentInstance.unFlagCell(p);
                GameVars.flaggedCells --;
            }

            BoardScene.currentInstance.hud.updateMines();

        } else {

            GameVars.board.openCell(p.c, p.r);

            GameVars.grid = GameVars.board.grid();

            BoardContainer.currentInstance.revealOpenedCells();

            let state = GameVars.board.state();

            if (state === GameConstants.BOARD_STATE_LOST) {
                BoardManager.matchOver(false, p);
            } else {
                // MIRAR EL NUMERO DE CELDAS QUE QUEDAN SIN ABRIR
                // con state 0
                let unopenedCells = 0;
                for (let r = 0; r < GameConstants.ROWS; r ++) {
                    for (let c = 0; c < GameConstants.COLS; c ++) {
                        if (GameVars.grid[r][c].state === 0) {
                            unopenedCells ++;
                        }
                    }
                }

                if (unopenedCells === GameVars.mines) {
                    state = GameConstants.BOARD_STATE_WON;
                }

                if (state === GameConstants.BOARD_STATE_LOST || state === GameConstants.BOARD_STATE_WON) {
                    BoardManager.matchOver(state === GameConstants.BOARD_STATE_WON, p);
                }
            }
        }
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
