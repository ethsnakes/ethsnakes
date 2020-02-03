import { GameVars } from "../../../GameVars";
import { GameConstants } from "../../../GameConstants";
import { BoardScene } from "../BoardScene";
import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";
import { AudioManager } from "../../../AudioManager";
import { BalanceContainer } from "../hud/BalanceContainer";

export class OutcomeLayer extends Phaser.GameObjects.Container {

    private scaledItemsContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0x000000, .7);
        background.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        background.alpha = 0;
        this.add(background);

        this.scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        this.scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        this.scaledItemsContainer.y = 300;
        this.scaledItemsContainer.scaleX = GameVars.scaleX;
        this.scaledItemsContainer.alpha = 0;
        this.add(this.scaledItemsContainer);

        if (GameVars.winner === GameConstants.PLAYER) {

            const balanceContainer = new BalanceContainer(this.scene);
            balanceContainer.onPlayerVictory();
            this.add(balanceContainer);

            const star = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "victory_result_01");
            this.scaledItemsContainer.add(star);

            this.scene.tweens.add({
                targets: star,
                scaleX: 1.15,
                scaleY: 1.15,
                ease: Phaser.Math.Easing.Cubic.InOut,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });

            const badge = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "victory_result_02");
            this.scaledItemsContainer.add(badge); 

            const ribbon = new Phaser.GameObjects.Sprite(this.scene, 0, 145, "texture_atlas_1", "victory_result_txt_01");
            BoardScene.currentInstance.add.existing(ribbon);
            this.scaledItemsContainer.add(ribbon); 

            ribbon.play("ribbon");

            AudioManager.playSound("victory");

        } else {

            const shadow = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "defeat_result_01");
            this.scaledItemsContainer.add(shadow);

            const badge = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "defeat_result_02");
            this.scaledItemsContainer.add(badge); 

            const ribbon = new Phaser.GameObjects.Image(this.scene, 0, 145, "texture_atlas_1", "defeat_result_txt");
            this.scaledItemsContainer.add(ribbon); 

            this.scene.tweens.add({
                targets: shadow,
                scaleX: 1.075,
                scaleY: 1.075,
                ease: Phaser.Math.Easing.Cubic.InOut,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });

            AudioManager.playSound("defeat");
        }

        this.scene.tweens.add({
            targets: [this.scaledItemsContainer, background],
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 800,
            delay: 1000,
            onComplete: this.showReplayItems,
            onCompleteScope: this
        });
    }

    private showReplayItems(): void {

        if (GameVars.winner === GameConstants.PLAYER) {

            const winningsLabel = new Phaser.GameObjects.Text(this.scene, 0, 270, "YOU'VE WON " + (2 * GameVars.bet) + " ETH" , {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "64px", color: "#FFFFFF"});
            winningsLabel.setOrigin(.5);
            winningsLabel.alpha = 0;
            this.scaledItemsContainer.add(winningsLabel); 

            this.scene.tweens.add({
                targets: winningsLabel,
                alpha: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 450
            });

            this.scene.time.delayedCall(1500, function(): void {

                winningsLabel.text = "REPLAY?";

                const replayButton = new Button(this.scene, 0, 370, "texture_atlas_1", "btn_play_off", "btn_play_on");
                replayButton.alpha = 0;
                replayButton.onDown(this.onClickReplay, this);
                this.scaledItemsContainer.add(replayButton);

                this.scene.tweens.add({
                    targets: replayButton,
                    alpha: 1,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    duration: 450
                });

            }, [], this);


        } else {

            const replayLabel = new Phaser.GameObjects.Text(this.scene, 0, 270, "REPLAY?", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "64px", color: "#FFFFFF"});
            replayLabel.setOrigin(.5);
            replayLabel.alpha = 0;
            this.scaledItemsContainer.add(replayLabel);
    
            const replayButton = new Button(this.scene, 0, 370, "texture_atlas_1", "btn_play_off", "btn_play_on");
            replayButton.alpha = 0;
            replayButton.onDown(this.onClickReplay, this);
            this.scaledItemsContainer.add(replayButton);
    
            this.scene.tweens.add({
                targets: [replayLabel, replayButton],
                alpha: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 450
            });
        }
    }

    private onClickReplay(): void {
        
        GameManager.replay();

        AudioManager.playSound("click");
    }
}
