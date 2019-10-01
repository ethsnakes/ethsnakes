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

        this.botChip = new Chip(this.scene, 1, false);
        this.add(this.botChip);

        this.playerChip = new Chip(this.scene, 1, true);
        this.add(this.playerChip);
    }

    public start(): void {
        //
    }

    public moveChip(): void {

        // TODO: EL ORDEN ZETA DE LAS FICHAS EN FUNCION DE LA Y

        let i: number;

        if (GameVars.turn === GameConstants.PLAYER) {

            i = this.playerChip.i + GameVars.diceResult;
            this.playerChip.move(i);
        } else {
            i = this.botChip.i + GameVars.diceResult;
            this.botChip.move(i);
        }
    }
}
