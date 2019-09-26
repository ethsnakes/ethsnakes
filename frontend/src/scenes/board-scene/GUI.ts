import { GameConstants } from "../../GameConstants";
import { Button } from "../../utils/Utils";
import { GameVars } from "../../GameVars";
import { BoardManager } from "./BoardManager";

export class GUI extends Phaser.GameObjects.Container {

    private diceButton: Button;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.diceButton = new Button(this.scene, GameConstants.GAME_WIDTH - 70 * GameVars.scaleX, GameConstants.GAME_HEIGHT - 70, "texture_atlas_1", "btn_dice_off", "btn_dice_on");
        this.diceButton.onUp(this.onClickDiceButton, this);
        this.add(this.diceButton);
    }

    public onClickDiceButton(): void {
       
        BoardManager.rollDice();
    }
}
