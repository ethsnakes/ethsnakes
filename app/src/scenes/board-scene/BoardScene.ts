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
import { OutcomeLayer } from "./layers/OutcomeLayer";

export class BoardScene extends Phaser.Scene {

    public static currentInstance: BoardScene;
    
    public hud: HUD;
    public boardContainer: BoardContainer;
    public gui: GUI;
    
    private settingsLayer: SettingsLayer;
    private dice: DiceContainer;
    private selectBetLayer: SelectBetLayer;
    private waitingLayer: WaitingLayer;
    private outcomeLayer: OutcomeLayer;
    
    constructor() {

        super("BoardScene");
    }

    public create(): void {

        this.add.text(-100, -100, "abcdefg", { fontFamily: "RussoOne", fontSize: 28, color: "#A6F834" });

        BoardScene.currentInstance = this;

        GameManager.setCurrentScene(this);

        BoardManager.init();

        this.addAnimations();

        this.add.image(GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "texture_atlas_1", "background");

        this.dice = new DiceContainer(this);
        this.add.existing(this.dice);

        this.hud = new HUD(this);
        this.add.existing(this.hud);

        this.boardContainer = new BoardContainer(this);
        this.add.existing(this.boardContainer);   

        this.gui = new GUI(this);
        this.add.existing(this.gui);

        // TODO: BORRAR ESTO
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

    public onTurnChanged(): void {

        this.gui.onTurnChanged();
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

        this.outcomeLayer = new OutcomeLayer(this);
        this.add.existing(this.outcomeLayer);
    }

    private addAnimations(): void {

        // la animación de espera
        this.anims.create({ 
            key: "waiting", 
            frames: this.anims.generateFrameNames("texture_atlas_3", { prefix: "waiting_loop_", start: 1, end: 46, zeroPad: 2}), 
            frameRate: 18,
            repeat: -1
        });

        // el dado rojo
        this.anims.create({ 
            key: "dice_red_2", 
            frames: this.anims.generateFrameNames("texture_atlas_4", { prefix: "dice2_red_", start: 1, end: 12, zeroPad: 2}), 
            frameRate: 24,
        });

        // el dado azul
        for (let i = 1; i <= 6; i ++) {

            this.anims.create({ 
                key: "dice_blue_" + i, 
                frames: this.anims.generateFrameNames("texture_atlas_4", { prefix: "dice_blue_" + i + "_", start: 1, end: 17, zeroPad: 2}), 
                frameRate: 26
            });

            this.anims.create({ 
                key: "dice_pink_" + i, 
                frames: this.anims.generateFrameNames("texture_atlas_4", { prefix: "dice_pink_" + i + "_", start: 1, end: 17, zeroPad: 2}), 
                frameRate: 26
            });
        }
        
        for (let i = 1; i <= 8; i ++) {

            this.anims.create({ 
                key: "snake_swallow_" + i, 
                frames: this.anims.generateFrameNames("texture_atlas_2", { prefix: "snake_" + i + "_", start: 1, end: 17, zeroPad: 2}), 
                frameRate: 24,
            });
        }

        // la animacion de la cinta
        this.anims.create({ 
            key: "ribbon", 
            frames: this.anims.generateFrameNames("texture_atlas_1", { prefix: "victory_result_txt_", start: 1, end: 10, zeroPad: 2}), 
            frameRate: 12
        });
    }
}
