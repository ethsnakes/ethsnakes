import { GameManager } from "../../GameManager";
import { GUI } from "./gui/GUI";
import { HUD } from "./HUD";
import { GameConstants } from "../../GameConstants";
import { BoardContainer } from "./BoardContainer";
import { BoardManager } from "./BoardManager";
import { SettingsLayer } from "./layers/SettingsLayer";
import { DiceContainer } from "./gui/DiceContainer";
import { GameVars } from "../../GameVars";
import { SelectBetLayer } from "./layers/SelectBetLayer";
import { WaitingLayer } from "./layers/WaitingLayer";

export class BoardScene extends Phaser.Scene {

    public static currentInstance: BoardScene;
    
    public hud: HUD;
    public boardContainer: BoardContainer;
    public gui: GUI;
    
    private settingsLayer: SettingsLayer;
    private dice: DiceContainer;
    private selectBetLayer: SelectBetLayer;
    private waitingLayer: WaitingLayer;
    
    constructor() {

        super("BoardScene");
    }

    public create(): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "RussoOne", fontSize: 28, color: "#A6F834" });

        BoardScene.currentInstance = this;

        GameManager.setCurrentScene(this);

        BoardManager.init(this);

        this.addDiceAnimations();

        this.add.image(GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "texture_atlas_1", "background");

        this.dice = new DiceContainer(this);
        this.add.existing(this.dice);

        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);   

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        // this.removeWaitingLayer();
    }

    public update(): void {

        if (this.waitingLayer) {
            this.waitingLayer.update();
        }

        this.boardContainer.update();
    }

    public showSelectBetLayer(): void {

        this.gui.disableButtons();

        this.selectBetLayer = new SelectBetLayer(this);
        this.add.existing(this.selectBetLayer);
    }

    public showWaitingLayer(): void {

        this.selectBetLayer.destroy();

        this.waitingLayer = new WaitingLayer(this);
        this.add.existing(this.waitingLayer);
    }

    public removeWaitingLayer(): void {

        if (this.waitingLayer) {
            this.waitingLayer.destroy();
            this.waitingLayer = null;
        }

        this.gui.enableButtons();
        this.gui.startGame();

        this.hud.startGame();

        this.boardContainer.starGame();
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

        // for (let i = 1; i <= 6; i ++) {
        //     const config = {
        //         key: "roll" + i,
        //         frames: this.anims.generateFrameNumbers("dice_red" + i, {}),
        //         frameRate: 24
        //     };
    
        //     this.anims.create(config);
        // }

        this.anims.create({ 
            key: "dice_red_2", 
            frames: this.anims.generateFrameNames("texture_atlas_1", { prefix: "dice2_red_", start: 1, end: 12, zeroPad: 2}), 
            frameRate: 24,
        });
    }
}
