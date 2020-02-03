import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { BoardScene } from "../BoardScene";
import { BoardManager } from "../BoardManager";
import { AudioManager } from "../../../AudioManager";

export class DiceContainer extends Phaser.GameObjects.Container {

    private playerDice: Phaser.GameObjects.Sprite;
    private botDice: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.botDice = new Phaser.GameObjects.Sprite(this.scene, GameConstants.GAME_WIDTH - 85 * GameVars.scaleX, 340, "texture_atlas_4", "dice_blue_3_01");
        BoardScene.currentInstance.add.existing(this.botDice);
        this.botDice.visible = false;
        this.add(this.botDice);

        this.botDice.on("animationcomplete", this.onAnimationComplete, this);

        this.playerDice = new Phaser.GameObjects.Sprite(this.scene, GameConstants.GAME_WIDTH - 85 * GameVars.scaleX, 430, "texture_atlas_4", "dice_pink_3_01");
        BoardScene.currentInstance.add.existing(this.playerDice);
        this.playerDice.visible = false;
        this.add(this.playerDice);

        this.playerDice.on("animationcomplete", this.onAnimationComplete, this);
    }

    public roll(i: number): void {

        if (GameVars.currentTurn === GameConstants.PLAYER) {
  
            this.scene.tweens.add({
                targets: this.botDice,
                alpha: 0,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 300,
                onComplete: function(): void {
                    this.botDice.visible = false;
                },
                onCompleteScope: this
            });

            this.playerDice.visible = true;
            this.playerDice.alpha = 0;

            this.scene.tweens.add({
                targets: this.playerDice,
                alpha: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 300
            });

            this.playerDice.play("dice_pink_" + i);

        } else {

            this.scene.tweens.add({
                targets: this.playerDice,
                alpha: 0,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 300,
                onComplete: function(): void {
                    this.playerDice.visible = false;
                },
                onCompleteScope: this
            });

            this.scene.time.delayedCall(450, function(): void {

                this.botDice.visible = true;
                this.botDice.alpha = 0;

                this.scene.tweens.add({
                    targets: this.botDice,
                    alpha: 1,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    duration: 800
                });
    
                this.botDice.play("dice_blue_" + i);

            }, [], this);
        }

        AudioManager.playSound("dice_" + Math.ceil(Math.random() * 3));
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
