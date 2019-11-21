import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { GameManager } from "../../../GameManager";

export class WaitingLayer extends Phaser.GameObjects.Container {

    private f: number;
    private connectingLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.f = 0;

        const transparentBackground = new Phaser.GameObjects.Graphics(this.scene);
        transparentBackground.fillStyle(0x000000, .8);
        transparentBackground.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        this.add(transparentBackground);

        const scaledItemsContainer = new Phaser.GameObjects.Container(this.scene);
        scaledItemsContainer.x = GameConstants.GAME_WIDTH / 2;
        scaledItemsContainer.scaleX = GameVars.scaleX;
        this.add(scaledItemsContainer);

        const waitingAnimation = new Phaser.GameObjects.Sprite(this.scene, 0, 220, "texture_atlas_3", "waiting_loop_01");
        this.scene.add.existing(waitingAnimation);
        waitingAnimation.play("waiting");
        scaledItemsContainer.add(waitingAnimation);

        this.connectingLabel = new Phaser.GameObjects.Text(this.scene, 0, 450, "CONNECTING TO ETHEREUM", {fontFamily: "RussoOne", fontSize: "40px", color: "#FFFFFF"});
        this.connectingLabel.setOrigin(.5);
        scaledItemsContainer.add(this.connectingLabel);

        const infoLabelSmartContract = new Phaser.GameObjects.Text(this.scene, 0, 520, "Smart contract address", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelSmartContract.setOrigin(.5);
        infoLabelSmartContract.scaleX = GameVars.scaleX;
        scaledItemsContainer.add(infoLabelSmartContract);

        const smartContractLabel = new Phaser.GameObjects.Text(this.scene, 0, 560, GameConstants.CONTRACT_ADDRESS, {fontFamily: "RussoOne", fontSize: "35px", color: "#FFFFFF"});
        smartContractLabel.setOrigin(.5);
        smartContractLabel.scaleX = GameVars.scaleX;
        scaledItemsContainer.add(smartContractLabel);

        const infoLabelTime = new Phaser.GameObjects.Text(this.scene, 0, 650, "This operation takes in average 15 seconds, please be patient.", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelTime.setOrigin(.5);
        infoLabelTime.scaleX = GameVars.scaleX;
        scaledItemsContainer.add(infoLabelTime);
    }

    public update(): void {

        this.f ++;

        if (this.f % 25 === 0) {
            this.connectingLabel.alpha = this.connectingLabel.alpha === 1 ? .5 : 1;
        }

        if (this.f === 300) {

            GameManager.onConnection();
        }
    }
}
