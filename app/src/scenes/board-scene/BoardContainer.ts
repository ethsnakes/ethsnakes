import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { Chip } from "./Chip";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly CELL_SIZE = 58;

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

        const snakesAndLadders = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "snakes_ladders");
        snakesAndLadders.setScale(.915);
        this.add(snakesAndLadders);

        this.botChip = new Chip(this.scene, 1, false);
        this.add(this.botChip);

        this.playerChip = new Chip(this.scene, 1, true);
        this.add(this.playerChip);

        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        if (this.botChip.y > this.playerChip.y) {
            this.bringToTop(this.botChip);
        } else {
            this.bringToTop(this.playerChip);
        }
    }

    public starGame(): void {
        
        if (GameVars.turn === GameConstants.PLAYER) {
            this.playerChip.mark();
        } else {
            this.botChip.mark();
        }
    }

    public moveChip(): void {

        let i: number;
        let chip: Chip;

        if (GameVars.turn === GameConstants.PLAYER) {
            chip = this.playerChip;
        } else {
            chip = this.botChip;
        }

        if (chip.marked) {
            chip.unMark();
        }

        i = chip.cellIndex + GameVars.diceResult;
        chip.move(i);
    }
}
