import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { Chip } from "./Chip";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly CELL_SIZE = 63.5;

    public static currentInstance: BoardContainer;

    private playerChip: Chip;
    private botChip: Chip;

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = 420;
        this.scaleX = GameVars.scaleX;

        const boardBackground = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "board");
        this.add(boardBackground);

        this.playerChip = new Chip(this.scene, 1, true);
        this.add(this.playerChip);

        this.playerChip.moveToCell(99);
    }

    public start(): void {
        //
    }

}
