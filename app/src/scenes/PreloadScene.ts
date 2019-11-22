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

        this.add.text(-100, -100, "abcdefg", { fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: 28, color: "#A6F834" });
    }

    private loadAssets(): void {

        this.load.atlas("texture_atlas_1", "assets/texture_atlas_1.png", "assets/texture_atlas_1.json");
        this.load.atlas("texture_atlas_2", "assets/texture_atlas_2.png", "assets/texture_atlas_2.json");
        this.load.atlas("texture_atlas_3", "assets/texture_atlas_3.png", "assets/texture_atlas_3.json");
        this.load.atlas("texture_atlas_4", "assets/texture_atlas_4.png", "assets/texture_atlas_4.json");
    }
}
