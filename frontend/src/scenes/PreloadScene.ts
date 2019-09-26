import { GameManager } from "../GameManager";

export class PreloadScene extends Phaser.Scene {

    public static currentInstance: PreloadScene;

    constructor() {

        super("PreloadScene");
    }

    public preload(): void {

        this.composeScene();

        this.loadAssets();
    }

    public create(): void {

        PreloadScene.currentInstance = this;

        GameManager.setCurrentScene(this);

        GameManager.onGameAssetsLoaded();
    }
    private composeScene(): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "RussoOne", fontSize: 28, color: "#A6F834" });
    }

    private loadAssets(): void {

        this.load.atlas("texture_atlas_1", "assets/texture_atlas_1.png", "assets/texture_atlas_1.json");
        this.load.bitmapFont("russo-one-red", "assets/fonts/russo-one.png", "assets/fonts/russo-one.xml");

        // los dados
        this.load.spritesheet("dice1", "assets/dice_1.png", { frameWidth: 150, frameHeight: 410 });
        this.load.spritesheet("dice2", "assets/dice_2.png", { frameWidth: 150, frameHeight: 410 });
        this.load.spritesheet("dice3", "assets/dice_3.png", { frameWidth: 150, frameHeight: 410 });
        this.load.spritesheet("dice4", "assets/dice_4.png", { frameWidth: 150, frameHeight: 410 });
        this.load.spritesheet("dice5", "assets/dice_5.png", { frameWidth: 150, frameHeight: 410 });
        this.load.spritesheet("dice6", "assets/dice_6.png", { frameWidth: 150, frameHeight: 410 });
    }
}
