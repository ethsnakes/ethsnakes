import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { BoardScene } from "./BoardScene";

export class DiceContainer extends Phaser.GameObjects.Container {

    private dice: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.dice = new Phaser.GameObjects.Sprite(this.scene, GameConstants.GAME_WIDTH - 100 * GameVars.scaleX, 550, "dice2");
        BoardScene.currentInstance.add.existing(this.dice);
        this.dice.visible = false;
        this.add(this.dice);
    }

    public roll(i: number): void {
       
        this.dice.visible = true;
        this.dice.play("roll" + i);
    }
}
