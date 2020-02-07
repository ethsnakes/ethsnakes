import { GameManager } from "../GameManager";
import { GameConstants } from "../GameConstants";
import { GameVars } from "../GameVars";
import { AudioManager } from "../AudioManager";

export class PreloadScene extends Phaser.Scene {

    public static currentInstance: PreloadScene;

    private progressBar: Phaser.GameObjects.Graphics;

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

        this.loadHowl();
    }

    private updateLoadedPercentage(percentageLoaded: number): void {

        this.progressBar.clear();
        this.progressBar.fillStyle(0xFFFFFF);
        this.progressBar.fillRect(0, GameConstants.GAME_HEIGHT - 12, percentageLoaded * GameConstants.GAME_WIDTH, 12);
    }

    private composeScene(): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: 28, color: "#A6F834" });
        this.add.text(-100, -50, "abcdefg", { fontFamily: "BladiTwo4F", fontSize: 28, color: "#A6F834" });

        this.add.image(GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "background");
        this.add.image(GameConstants.GAME_WIDTH / 2, 325, "game-logo");
       
        const loadingText = this.add.text(10, GameConstants.GAME_HEIGHT - 55, "LOADING", {fontFamily: "BladiTwo4F", fontSize: "36px", color: "#FFFFFF", align: "center"});
        loadingText.scaleX = GameVars.scaleX;
       
        this.progressBar = this.add.graphics();
    }

    private loadAssets(): void {

        this.load.atlas("texture_atlas_1", "assets/texture_atlas_1.png", "assets/texture_atlas_1.json");
        this.load.atlas("texture_atlas_2", "assets/texture_atlas_2.png", "assets/texture_atlas_2.json");
        this.load.atlas("texture_atlas_3", "assets/texture_atlas_3.png", "assets/texture_atlas_3.json");
        this.load.atlas("texture_atlas_4", "assets/texture_atlas_4.png", "assets/texture_atlas_4.json");

        this.load.json("audiosprite", "assets/audio/audiosprite.json");
        
        this.load.on("progress", this.updateLoadedPercentage, this);
    }

    private loadHowl(): void {

        let json = this.cache.json.get("audiosprite");
        json = JSON.parse(JSON.stringify(json).replace("urls", "src"));
        json = JSON.parse(JSON.stringify(json).replace("../", ""));
        json = JSON.parse(JSON.stringify(json).replace("../", ""));

        AudioManager.howl = new Howl(json);

        AudioManager.howl.on("load", function(): void {
            GameManager.onGameAssetsLoaded();
        });
    }
}
