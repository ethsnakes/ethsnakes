import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static currentInstance: BoardContainer;

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = 420;

        const boardBackground = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "board");
        boardBackground.scaleX = GameVars.scaleX;
        this.add(boardBackground);
    }

    public start(): void {
        //
    }

    public flagCell(p: { r: number, c: number }): void {

        //
    }

    public unFlagCell(p: { r: number, c: number }): void {
       //
    }

    public revealOpenedCells(): void {
        //
    }

    public isCellOpen(p: {r: number, c: number}): boolean {

        return true;
    }

    public isCellFlagged(p: {r: number, c: number}): boolean {

        return true;
    }

    public revealMinedCells(p: {r: number, c: number}): void {
        //
    }

    public hideFlags(): void {
        //
    }

    public showFlags(): void {
        //
    }
}
