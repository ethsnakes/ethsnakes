import { GameVars } from "../../GameVars";
import { GameConstants } from "../../GameConstants";

export class OutcomeLayer extends Phaser.GameObjects.Container {

    private container1: Phaser.GameObjects.Container;
    private container2: Phaser.GameObjects.Container;
    private f: number;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const w = 210;
        const h = 100;

        this.f = 0;
        this.visible = false;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF, .8);
        background.fillRect(0, 0, w, h);
        this.add(background);

        background.x = GameConstants.GAME_WIDTH / 2 - w / 2;
        background.y = GameConstants.GAME_HEIGHT / 2 - h / 2;

        this.container1 = new Phaser.GameObjects.Container(this.scene);
        this.container1.x = GameConstants.GAME_WIDTH / 2;
        this.container1.y = 180 - 3;
        this.add(this.container1);

        this.container2 = new Phaser.GameObjects.Container(this.scene);
        this.container2.x = GameConstants.GAME_WIDTH / 2;
        this.container2.y = 180 + 3;
        this.add(this.container2);

        let label = new Phaser.GameObjects.Text(this.scene, 0, -45, "Y   U   W  N", {fontFamily: "RussoOne", fontSize: "35px", color: "#080893"}); 
        label.setOrigin(.5);
        this.container1.add(label);

        label = new Phaser.GameObjects.Text(this.scene, -58, -45, "O", {fontFamily: "RussoOne", fontSize: "35px", color: "#080893"}); 
        label.setOrigin(.5);
        this.container2.add(label);

        label = new Phaser.GameObjects.Text(this.scene, 62, -45, "I", {fontFamily: "RussoOne", fontSize: "35px", color: "#080893"}); 
        label.setOrigin(.5);
        this.container2.add(label);
    }
}
