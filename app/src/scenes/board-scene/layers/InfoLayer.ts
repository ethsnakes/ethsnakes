import { BoardScene } from "./../BoardScene";
import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { BoardManager } from "../BoardManager";

export class InfoLayer extends Phaser.GameObjects.Container {

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

        const text = new Phaser.GameObjects.Text(this.scene, 0, -60, "The first player that reaches the end of the board wins.\n\nLaunch the dice to move your piece, if you get a 6 you'll get an extra turn.\n\nLadders will help you reach the top, but snakes will make you go down.", {fontFamily: "BladiTwo4F", fontSize: "22px", color: "#3f680c", align: "center"});
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
    }
}
