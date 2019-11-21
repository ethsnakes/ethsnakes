import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";
import { BoardScene } from "./BoardScene";
import { BoardManager } from "./BoardManager";

export class HUD extends Phaser.GameObjects.Container {

    private balanceLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "top_bar");
        background.setOrigin(0);
        this.add(background);

        const balanceContainer = new Phaser.GameObjects.Container(this.scene);
        balanceContainer.setPosition(200, 40);
        this.add(balanceContainer);

        const balanceContainerBackground = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "balance");
        balanceContainer.add(balanceContainerBackground);

        const yourBalanceLabel = new Phaser.GameObjects.Text(this.scene, -100, -15, "BALANCE:", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "28px", color: "#7A431C"});
        yourBalanceLabel.scaleX = GameVars.scaleX;
        balanceContainer.add(yourBalanceLabel);

        this.balanceLabel = new Phaser.GameObjects.Text(this.scene, (yourBalanceLabel.x + yourBalanceLabel.width + 20) * GameVars.scaleX, yourBalanceLabel.y, GameVars.balance + " ETH", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "28px", color: "#7A431C"});
        this.balanceLabel.scaleX = GameVars.scaleX;
        balanceContainer.add(this.balanceLabel);
    }

    public playerClimbsLadder(): void {

        const superImage = new Phaser.GameObjects.Image(this.scene, GameConstants.GAME_WIDTH * 3 / 2, GameConstants.GAME_HEIGHT / 2, "texture_atlas_1", "super_txt");
        superImage.scaleX = GameVars.scaleX;
        BoardScene.currentInstance.add.existing(superImage);

        this.scene.tweens.add({
            targets: superImage,
            x: GameConstants.GAME_WIDTH / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 500,
            onComplete: function(): void {
                this.scene.tweens.add({
                    targets: superImage,
                    x: -GameConstants.GAME_WIDTH / 2,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    delay: 750,
                    duration: 500,
                    onComplete: function(): void {
                        superImage.destroy();
                    },
                    onCompleteScope: this
                });
            },
            onCompleteScope: this
        });
    }

    public startGame(): void {
        
        let turnImageName = GameVars.turn === GameConstants.PLAYER ? "start_txt_02" : "start_txt_01";
       
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
                        BoardManager.startGame();
                    },
                    onCompleteScope: this
                });
            },
            onCompleteScope: this
        });
    }
}
