import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";
import { AmountSelectionButtonsContainer } from "./AmountSelectionButtonsContainer";
import { AudioManager } from "../../../AudioManager";

export class AmountSelectionLayer extends Phaser.GameObjects.Container {

    public static currentInstance: AmountSelectionLayer;

    private selectedAmountValue: number;
    private betSelectionButtonsContainer: AmountSelectionButtonsContainer;
    private playButton: Button;

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

        this.betSelectionButtonsContainer = new AmountSelectionButtonsContainer(this.scene);
        scaledItemsContainer.add(this.betSelectionButtonsContainer);

        this.playButton = new Button(this.scene, 0, 585, "texture_atlas_1", "btn_play_off", "btn_play_on");
        this.playButton.setScale(0);
        this.playButton.onUp(this.onClickPlay, this);
        this.playButton.visible = false;
        scaledItemsContainer.add(this.playButton);
    }

    public betSelected(value: number): void {

        this.selectedAmountValue = value;

        if (!this.playButton.visible) {

            this.playButton.visible = true;

            this.scene.tweens.add({
                targets: this.playButton,
                scaleX: 1,
                scaleY: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 400
            });
        }

        this.betSelectionButtonsContainer.betSelected(value);

        AudioManager.playSound("click");
    }

    private onClickPlay(): void {

        GameManager.onPlayerSelectedAmount(this.selectedAmountValue);

        AudioManager.playSound("click");
    }
}
