import { GameVars } from "../../../GameVars";
import { GameConstants } from "../../../GameConstants";
import { BoardScene } from "../BoardScene";
import { BoardManager } from "../BoardManager";
import { AudioManager } from "../../../AudioManager";
import { BalanceContainer } from "./BalanceContainer";

export class HUD extends Phaser.GameObjects.Container {

    private superImage: Phaser.GameObjects.Image;
    private extraDiceImage: Phaser.GameObjects.Image;
    private balanceContainer: BalanceContainer;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.visible = false;

        this.superImage = null;
        this.extraDiceImage = null;

        const background = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "top_bar");
        background.setOrigin(0);
        this.add(background);

        this.balanceContainer = new BalanceContainer(this.scene);
        this.add(this.balanceContainer);
    }

    public onBalanceAvailable(): void {

        this.visible = true;

        this.balanceContainer.onBalanceAvailable();
    }

    public onTransactionExecuted(): void {

        this.balanceContainer.onTransactionExecuted();
    }

    public playerClimbsLadder(): void {

        if (this.extraDiceImage) {
            return;
        }

        this.superImage = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "texture_atlas_1", "super_txt");
        this.superImage.scaleX = GameVars.scaleX;
        BoardScene.currentInstance.add.existing(this.superImage);

        this.scene.tweens.add({
            targets: this.superImage,
            x: GameConstants.GAME_WIDTH / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            onComplete: function(): void {
                this.scene.tweens.add({
                    targets: this.superImage,
                    x: -GameConstants.GAME_WIDTH / 2,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    delay: 750,
                    duration: 500,
                    onComplete: function(): void {
                        this.superImage.destroy();
                        this.superImage = null;
                    },
                    onCompleteScope: this,
                    onStart: function (): void {
                        AudioManager.playSound("text_out");
                    },
                    onStartScope: this
                });
            },
            onCompleteScope: this
        });

        AudioManager.playSound("text_in");
    }

   public extraDice(): void {

        this.extraDiceImage = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "texture_atlas_1", "extra_dice_txt");
        this.extraDiceImage.scaleX = GameVars.scaleX;
        BoardScene.currentInstance.add.existing(this.extraDiceImage);

        this.scene.tweens.add({
            targets: this.extraDiceImage,
            x: GameConstants.GAME_WIDTH / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            onComplete: function(): void {
                this.scene.tweens.add({
                    targets: this.extraDiceImage,
                    x: -GameConstants.GAME_WIDTH / 2,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    delay: 750,
                    duration: 500,
                    onComplete: function(): void {
                        this.extraDiceImage.destroy();
                        this.extraDiceImage = null;
                    },
                    onCompleteScope: this,
                    onStart: function (): void {
                        AudioManager.playSound("text_out");
                    },
                    onStartScope: this
                });
            },
            onCompleteScope: this
        });

        AudioManager.playSound("six");
        AudioManager.playSound("text_in");
    }

    public startMatch(): void {
        
        let turnImageName = GameVars.currentTurn === GameConstants.PLAYER ? "start_txt_02" : "start_txt_01";
       
        const turnImg = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH * 3 / 2, GameConstants.GAME_HEIGHT / 2, "texture_atlas_1", turnImageName);
        turnImg.scaleX = GameVars.scaleX;
        turnImg.setOrigin(.5);
        BoardScene.currentInstance.add.existing(turnImg);

        this.scene.tweens.add({
            targets: turnImg,
            x: GameConstants.GAME_WIDTH / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            onComplete: function(): void {
                this.scene.tweens.add({
                    targets: turnImg,
                    x: -GameConstants.GAME_WIDTH / 2,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    delay: 1500,
                    duration: 500,
                    onComplete: function(): void {
                        turnImg.destroy();
                        BoardManager.onTurnMessageRemoved();
                    },
                    onCompleteScope: this,
                    onStart: function (): void {
                        AudioManager.playSound("text_out");
                    },
                    onStartScope: this
                });
            },
            onCompleteScope: this
        });

        AudioManager.playSound("text_in");
    }
}
