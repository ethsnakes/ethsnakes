import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { BoardScene } from "../BoardScene";
import { BoardManager } from "../BoardManager";

export class DiceContainer extends Phaser.GameObjects.Container {

    private playerDice: Phaser.GameObjects.Sprite;
    private botDice: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.botDice = new Phaser.GameObjects.Sprite(this.scene, GameConstants.GAME_WIDTH - 150 * GameVars.scaleX, 280, "texture_atlas_4", "dice_blue_3_01");
        BoardScene.currentInstance.add.existing(this.botDice);
        this.botDice.visible = false;
        this.add(this.botDice);

        this.botDice.on("animationcomplete", this.onAnimationComplete, this);

        this.playerDice = new Phaser.GameObjects.Sprite(this.scene, GameConstants.GAME_WIDTH - 115 * GameVars.scaleX, 300, "texture_atlas_4", "dice2_red_01");
        this.playerDice.setScale(.5);
        BoardScene.currentInstance.add.existing(this.playerDice);
        this.playerDice.visible = false;
        this.add(this.playerDice);

        this.playerDice.on("animationcomplete", this.onAnimationComplete, this);
    }

    public roll(i: number): void {

        if (GameVars.turn === GameConstants.PLAYER) {

            this.botDice.visible = false;

            this.playerDice.visible = true;
            this.playerDice.play("dice_red_" + i);

        } else {

            this.playerDice.visible = false;

            this.botDice.visible = true;
            this.botDice.alpha = 0;

            this.scene.tweens.add({
                targets: this.botDice,
                alpha: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 800
            });

            this.botDice.play("dice_blue_" + i);
        }
    }

    public matchOver(): void {

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 300
        });
    }

    private onAnimationComplete(): void {

        BoardManager.onDiceResultAvailable();
    }
}
