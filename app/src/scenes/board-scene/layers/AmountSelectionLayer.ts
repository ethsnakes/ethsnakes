import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";
import { AmountSelectionButtonsContainer } from "./AmountSelectionButtonsContainer";
import { AudioManager } from "../../../AudioManager";

export class AmountSelectionLayer extends Phaser.GameObjects.Container {

    public static currentInstance: AmountSelectionLayer;

    public amountSelectionButtonsContainer: AmountSelectionButtonsContainer;
    
    private selectedAmountValue: number;
    private confirmButton: Button;
    private backButton: Button;

    constructor(scene: Phaser.Scene) {

        super(scene);

        AmountSelectionLayer.currentInstance = this;

        this.selectedAmountValue = 0;

        const transparentBackground = new Phaser.GameObjects.Graphics(this.scene);
        transparentBackground.fillStyle(0x000000, .8);
        transparentBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        this.add(transparentBackground);

        const scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        scaledItemsContainer.scaleX = GameVars.scaleX;
        this.add(scaledItemsContainer);

        this.amountSelectionButtonsContainer = new AmountSelectionButtonsContainer(this.scene);
        scaledItemsContainer.add(this.amountSelectionButtonsContainer);

        this.confirmButton = new Button(this.scene, 0, 585, "texture_atlas_1", "btn_play_off", "btn_play_on");
        this.confirmButton.setScale(0);
        this.confirmButton.onUp(this.onClickConfirm, this);
        this.confirmButton.visible = false;
        scaledItemsContainer.add(this.confirmButton);

        this.backButton = new Button(this.scene, 40 * GameVars.scaleX, 40, "texture_atlas_1", "btn_back_off", "btn_back_on");
        this.backButton.scaleX = GameVars.scaleX;
        this.backButton.onDown(this.onBack, this);
        this.add(this.backButton);
    }

    public betSelected(value: number): void {

        this.selectedAmountValue = value;

        if (!this.confirmButton.visible) {

            this.confirmButton.visible = true;

            this.scene.tweens.add({
                targets: this.confirmButton,
                scaleX: 1,
                scaleY: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 400
            });
        }

        this.amountSelectionButtonsContainer.betSelected(value);

        AudioManager.playSound("click");
    }

    private onClickConfirm(): void {

        this.confirmButton.visible = false;
        this.backButton.visible = false;

        GameManager.onPlayerConfirmedAmount(this.selectedAmountValue);

        AudioManager.playSound("click");
    }

    private onBack(): void {

        GameManager.hideAmountSelectionLayer();

        AudioManager.playSound("click");
    }
}
