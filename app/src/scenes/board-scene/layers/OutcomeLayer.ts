import { GameVars } from "../../../GameVars";
import { GameConstants } from "../../../GameConstants";
import { BoardScene } from "../BoardScene";

export class OutcomeLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0x000000, .7);
        background.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        this.add(background);

        const scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        scaledItemsContainer.y = 300;
        scaledItemsContainer.scaleX = GameVars.scaleX;
        this.add(scaledItemsContainer);

        if (GameVars.winner === GameConstants.PLAYER) {

            const star = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "victory_result_01");
            scaledItemsContainer.add(star);

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
            scaledItemsContainer.add(badge); 

            const ribbon = new Phaser.GameObjects.Sprite(this.scene, 0, 145, "texture_atlas_1", "victory_result_txt_01");
            BoardScene.currentInstance.add.existing(ribbon);
            scaledItemsContainer.add(ribbon); 

            ribbon.play("ribbon");

        } else {

            const shadow = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "defeat_result_01");
            scaledItemsContainer.add(shadow);

            const badge = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "defeat_result_02");
            scaledItemsContainer.add(badge); 

            const ribbon = new Phaser.GameObjects.Image(this.scene, 0, 145, "texture_atlas_1", "defeat_result_txt");
            scaledItemsContainer.add(ribbon); 

            this.scene.tweens.add({
                targets: shadow,
                scaleX: 1.075,
                scaleY: 1.075,
                ease: Phaser.Math.Easing.Cubic.InOut,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }
}
