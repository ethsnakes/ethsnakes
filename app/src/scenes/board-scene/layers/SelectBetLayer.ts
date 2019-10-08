import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";
import { BetSelectionButtonsContainer } from "./BetSelectionButtonsContainer";

export class SelectBetLayer extends Phaser.GameObjects.Container {

    public static currentInstance: SelectBetLayer;

    private betSelectionButtonsContainer: BetSelectionButtonsContainer;

    constructor(scene: Phaser.Scene) {

        super(scene);

        SelectBetLayer.currentInstance = this;

        const transparentBackground = new Phaser.GameObjects.Graphics(this.scene);
        transparentBackground.fillStyle(0x000000, .8);
        transparentBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        this.add(transparentBackground);

        const scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        scaledItemsContainer.scaleX = GameVars.scaleX;
        this.add(scaledItemsContainer);

        this.betSelectionButtonsContainer = new BetSelectionButtonsContainer(this.scene);
        scaledItemsContainer.add(this.betSelectionButtonsContainer);

        const playButton = new Button(this.scene, 0, 550, "texture_atlas_1", "btn_play_off", "btn_play_on");
        playButton.scaleX = GameVars.scaleX;
        playButton.onUp(this.onClickPlay, this);
        scaledItemsContainer.add(playButton);
    }

    public betSelected(value: number): void {

        this.betSelectionButtonsContainer.betSelected(value);
    }

    private onClickPlay(): void {

        GameManager.connectToEthereum();
    }
}
