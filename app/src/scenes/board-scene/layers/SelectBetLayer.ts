import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";

export class SelectBetLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        const transparentBackground = new Phaser.GameObjects.Graphics(this.scene);
        transparentBackground.fillStyle(0x000000, .8);
        transparentBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        this.add(transparentBackground);

        const scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        scaledItemsContainer.scaleX = GameVars.scaleX;
        this.add(scaledItemsContainer);

        const infoLabelBet = new Phaser.GameObjects.Text(this.scene, 0, 400, "Select your bet", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelBet.setOrigin(.5);
        infoLabelBet.scaleX = GameVars.scaleX;
        scaledItemsContainer.add(infoLabelBet);

        const playButton = new Button(this.scene, 0, 550, "texture_atlas_1", "btn_play_off", "btn_play_on");
        playButton.scaleX = GameVars.scaleX;
        playButton.onUp(this.onClickPlay, this);
        scaledItemsContainer.add(playButton);
    }

    private onClickPlay(): void {

        GameManager.connectToEthereum();
    }
}
