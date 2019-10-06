import { GameConstants } from "../../GameConstants";
import { Button } from "../../utils/Utils";
import { GameVars } from "../../GameVars";
import { BoardManager } from "./BoardManager";
import { GameManager } from "../../GameManager";
import { DevelopmentMenu } from "./DevelopmentMenu";

export class GUI extends Phaser.GameObjects.Container {

    private settingsButton: Button;
    private diceButton: Button;
    private addFundsButton: Button;
    private retrieveFundsButton: Button;
    private playButton: Button;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.playButton = new Button(this.scene, 90 * GameVars.scaleX, 170, "texture_atlas_1", "btn_play_off", "btn_play_on");
        this.playButton.scaleX = GameVars.scaleX;
        this.playButton.onUp(this.onClickPlay, this);
        this.add(this.playButton);

        this.addFundsButton = new Button(this.scene, GameConstants.GAME_WIDTH - 340 * GameVars.scaleX, 40, "texture_atlas_1", "btn_add_funds_off", "btn_add_funds_on");
        this.addFundsButton.scaleX = GameVars.scaleX;
        this.addFundsButton.onUp(this.onClickAddFunds, this);
        this.add(this.addFundsButton);

        this.retrieveFundsButton = new Button(this.scene, GameConstants.GAME_WIDTH - 170 * GameVars.scaleX, 40, "texture_atlas_1", "btn_retrieve_funds_off", "btn_retrieve_funds_on");
        this.retrieveFundsButton.scaleX = GameVars.scaleX;
        this.retrieveFundsButton.onUp(this.onClickRetrieveFunds, this);
        this.add(this.retrieveFundsButton);

        this.settingsButton = new Button(this.scene, GameConstants.GAME_WIDTH - 40 * GameVars.scaleX, 40, "texture_atlas_1", "btn_settings_off", "btn_settings_on");
        this.settingsButton.scaleX = GameVars.scaleX;
        this.settingsButton.onUp(this.onClickSettings, this);
        this.add(this.settingsButton);

        this.diceButton = new Button(this.scene, GameConstants.GAME_WIDTH - 70 * GameVars.scaleX, GameConstants.GAME_HEIGHT - 70, "texture_atlas_1", "btn_dice_off", "btn_dice_on");
        this.diceButton.scaleX = GameVars.scaleX;
        this.diceButton.onUp(this.onClickDiceButton, this);
        this.diceButton.visible = false;
        this.add(this.diceButton);

        if (GameConstants.DEVELOPMENT) {
            const developmentMenu = new DevelopmentMenu(this.scene);
            this.add(developmentMenu);
        }
    }

    public startGame(): void {

        this.diceButton.visible = true;
    }

    public disableButtons(): void {

        this.playButton.disableInteractive();
        this.addFundsButton.disableInteractive();
        this.retrieveFundsButton.disableInteractive();
        this.settingsButton.disableInteractive();
        this.diceButton.disableInteractive();
    }

    public enableButtons(): void {

        this.playButton.setInteractive();
        this.addFundsButton.setInteractive();
        this.retrieveFundsButton.disableInteractive();
        this.settingsButton.setInteractive();
        this.diceButton.setInteractive();
    }

    public matchOver(): void {

        this.diceButton.disableInteractive();

        this.scene.tweens.add({
            targets: this.diceButton,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 300, 
            onComplete: function(): void {
                this.diceButton.visible = false;
            },
            onCompleteScope: this
        });
    }

    private onClickPlay(): void {
        
        GameManager.play();
    }

    private onClickAddFunds(): void {

        GameManager.addFunds();
    }

    private onClickRetrieveFunds(): void {

        GameManager.retrieveFunds();
    }

    private onClickSettings(): void {
       
        BoardManager.onClickSettings();
    }

    private onClickDiceButton(): void {
       
        BoardManager.rollDice();
    }
}
