import { GameConstants } from "../../GameConstants";
import { Button } from "../../utils/Utils";
import { GameVars } from "../../GameVars";
import { BoardManager } from "./BoardManager";
import { GameManager } from "../../GameManager";

export class GUI extends Phaser.GameObjects.Container {

    private settingsButton: Button;
    private diceButton: Button;
    private addFundsButton: Button;
    private retrieveFundsButton;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.addFundsButton = new Button(this.scene, GameConstants.GAME_WIDTH - -280 * GameVars.scaleX, 40, "texture_atlas_1", "btn_settings_off", "btn_settings_on");
        this.addFundsButton.scaleX = GameVars.scaleX;
        this.addFundsButton.onUp(this.onClickAddFunds, this);
        this.add(this.addFundsButton);

        this.retrieveFundsButton = new Button(this.scene, GameConstants.GAME_WIDTH - 180 * GameVars.scaleX, 40, "texture_atlas_1", "btn_settings_off", "btn_settings_on");
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
        this.add(this.diceButton);
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
