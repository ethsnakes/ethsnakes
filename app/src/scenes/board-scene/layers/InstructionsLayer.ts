import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { BoardManager } from "../BoardManager";
import { AudioManager } from "../../../AudioManager";

export class InstructionsLayer extends Phaser.GameObjects.Container {

    private scaledItemsContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0x495471, .7);
        background.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        background.setInteractive(new Phaser.Geom.Rectangle(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT), Phaser.Geom.Rectangle.Contains);
        background.on("pointerdown", () => {
            //
        }, this);
        this.add(background);

        this.scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        this.scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        this.scaledItemsContainer.y = GameConstants.GAME_HEIGHT / 2;
        this.scaledItemsContainer.scaleX = GameVars.scaleX;
        this.add(this.scaledItemsContainer);

        const title = new Phaser.GameObjects.Image(this.scene, 0, -260, "texture_atlas_1", "header_tutorial");
        this.scaledItemsContainer.add(title);

        const base = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "layout_base");
        this.scaledItemsContainer.add(base);

        const text = new Phaser.GameObjects.Text(this.scene, 0, -60, "Roll your dice to move your piece. If you get a six you will earn an extra turn.\n\nLadders will help you reach the top, but watch out for the snakes!\n\nThe first player to reach the very last square on the board wins.", {fontFamily: "BladiTwo4F", fontSize: "22px", color: "#3f680c", align: "center"});
        text.setOrigin(.5);
        text.setWordWrapWidth(500);
        this.scaledItemsContainer.add(text);

        const image = new Phaser.GameObjects.Image(this.scene, 0, 120, "texture_atlas_1", "tutorial_img");
        this.scaledItemsContainer.add(image);

        const okButton = new Button(this.scene, 0, 280, "texture_atlas_1", "btn_ok_off", "btn_ok_on");
        okButton.onDown(this.onOkDown, this);
        this.scaledItemsContainer.add(okButton);

        this.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 400
        });
    }

    private onOkDown(): void {

        BoardManager.hideInfoLayer();

        AudioManager.playSound("click");
    }
}
