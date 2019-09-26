import { GameManager } from "../../GameManager";
import { GUI } from "./GUI";
import { HUD } from "./HUD";
import { GameConstants } from "../../GameConstants";
import { BoardContainer } from "./BoardContainer";
import { BoardManager } from "./BoardManager";
import { SettingsLayer } from "./SettingsLayer";
import { OutcomeLayer } from "./OutcomeLayer";

export class BoardScene extends Phaser.Scene {

    public static currentInstance: BoardScene;
    
    public hud: HUD;
    public boardContainer: BoardContainer;
    public gui: GUI;
    
    private settingsLayer: SettingsLayer;
    
    constructor() {

        super("BoardScene");
    }

    public create(): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "RussoOne", fontSize: 28, color: "#A6F834" });

        BoardScene.currentInstance = this;

        GameManager.setCurrentScene(this);

        BoardManager.init(this);

        this.addDiceAnimations();

        const background = this.add.graphics();
        background.fillStyle(0xAAAAAA);
        background.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);

        this.boardContainer.visible = false;

       

        const dice = this.add.sprite(GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "dice2");
       
        dice.play("roll2");

        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);
    }

    public showSettingsLayer(): void {

        this.settingsLayer = new SettingsLayer(this);
        this.add.existing(this.settingsLayer);
    }

    public hideSettingsLayer(): void {

        this.settingsLayer.destroy();
    }

    public matchOver(won: boolean, p: {r: number, c: number}): void {

        if (won) {
            
            this.boardContainer.showFlags();

            const outcomeLayer = new OutcomeLayer(this);
            this.add.existing(outcomeLayer);

        } else {
            
            this.boardContainer.revealMinedCells(p);
            this.boardContainer.hideFlags();
        }
    }

    private addDiceAnimations(): void {

        for (let i = 1; i <= 6; i ++) {
            const config = {
                key: "roll" + i,
                frames: this.anims.generateFrameNumbers("dice" + i, {}),
                frameRate: 24
            };
    
            this.anims.create(config);
        }
    }
}
