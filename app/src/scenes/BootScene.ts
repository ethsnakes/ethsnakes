import { GameManager } from "../GameManager";

export class BootScene extends Phaser.Scene {

    public static currentInstance: BootScene;
    
    constructor() {

        super("BootScene");
    }

    public preload(): void {

        this.load.image("background", "assets/background.jpg");
        this.load.image("game-logo", "assets/game_logo.png");
    }

    public create(): void {

        BootScene.currentInstance = this;
        GameManager.setCurrentScene(this);

        GameManager.init();
    }
}
