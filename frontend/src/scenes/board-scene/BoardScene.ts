import { GameManager } from "../../GameManager";
import { GUI } from "./GUI";
import { HUD } from "./HUD";
import { GameConstants } from "../../GameConstants";
import { BoardContainer } from "./BoardContainer";
import { BoardManager } from "./BoardManager";
import { SettingsLayer } from "./SettingsLayer";
import { DiceContainer } from "./DiceContainer";
import { GameVars } from "../../GameVars";

export class BoardScene extends Phaser.Scene {

    public static currentInstance: BoardScene;
    
    public hud: HUD;
    public boardContainer: BoardContainer;
    public gui: GUI;
    
    private settingsLayer: SettingsLayer;
    private dice: DiceContainer;
    
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

        this.dice = new DiceContainer(this);
        this.add.existing(this.dice);

        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);        
    }

    public rollDice(): void {

        this.dice.roll(GameVars.diceResult);
    }

    public moveChip(): void {
        
        this.boardContainer.moveChip();
    }

    public showSettingsLayer(): void {

        this.settingsLayer = new SettingsLayer(this);
        this.add.existing(this.settingsLayer);
    }

    public hideSettingsLayer(): void {

        this.settingsLayer.destroy();
    }

    public matchOver(): void {
        
        this.dice.matchOver();
        this.gui.matchOver();
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
