import { GameConstants } from "../../GameConstants";
import { GameManager } from "../../GameManager";
import { GameVars } from "../../GameVars";
import { BoardManager } from "./BoardManager";

export class GUI extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = 18;
    }

    public matchOver(won: boolean): void {

       //
    }
}
