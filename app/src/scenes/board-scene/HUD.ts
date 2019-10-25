import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { Game } from "phaser";
import { BoardScene } from "./BoardScene";
import { BoardManager } from "./BoardManager";

export class HUD extends Phaser.GameObjects.Container {

    private balanceLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "top_bar");
        background.setOrigin(0);
        this.add(background);

        const yourBalanceLabel = new Phaser.GameObjects.Text(this.scene, 10, 15, "YOUR BALANCE:", {fontFamily: "RussoOne", fontSize: "40px", color: "#000000"});
        yourBalanceLabel.scaleX = GameVars.scaleX;
        this.add(yourBalanceLabel);

        this.balanceLabel = new Phaser.GameObjects.Text(this.scene, (yourBalanceLabel.x + yourBalanceLabel.width + 20) * GameVars.scaleX, yourBalanceLabel.y, GameVars.balance + " ETH" , {fontFamily: "RussoOne", fontSize: "40px", color: "#000000"});
        this.balanceLabel.scaleX = GameVars.scaleX;
        this.add(this.balanceLabel);
    }

    public playerClimbsLadder(): void {

        const superLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH * 3 / 2, GameConstants.GAME_HEIGHT / 2, "SUPER", {fontFamily: "RussoOne", fontSize: "75px", color: "#FFFFFF"});
        superLabel.scaleX = GameVars.scaleX;
        superLabel.setOrigin(.5);
        BoardScene.currentInstance.add.existing(superLabel);

        this.scene.tweens.add({
            targets: superLabel,
            x: GameConstants.GAME_WIDTH / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            onComplete: function(): void {
                this.scene.tweens.add({
                    targets: superLabel,
                    x: -GameConstants.GAME_WIDTH / 2,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    delay: 750,
                    duration: 500,
                    onComplete: function(): void {
                        superLabel.destroy();
                    },
                    onCompleteScope: this
                });
            },
            onCompleteScope: this
        });
    }

    public startGame(): void {
        
        let turnStr: string;
        if (GameVars.turn === GameConstants.PLAYER) {
            turnStr = "YOU START";
        } else {
            turnStr = "ADVERSARY STARTS";
        }

        const turnLabel = new Phaser.GameObjects.Text(this.scene, GameConstants.GAME_WIDTH * 3 / 2, GameConstants.GAME_HEIGHT / 2, turnStr, {fontFamily: "RussoOne", fontSize: "75px", color: "#FFFFFF"});
        turnLabel.scaleX = GameVars.scaleX;
        turnLabel.setOrigin(.5);
        BoardScene.currentInstance.add.existing(turnLabel);

        this.scene.tweens.add({
            targets: turnLabel,
            x: GameConstants.GAME_WIDTH / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            onComplete: function(): void {
                this.scene.tweens.add({
                    targets: turnLabel,
                    x: -GameConstants.GAME_WIDTH / 2,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    delay: 1500,
                    duration: 500,
                    onComplete: function(): void {
                        turnLabel.destroy();
                        BoardManager.startGame();
                    },
                    onCompleteScope: this
                });
            },
            onCompleteScope: this
        });
    }
}
