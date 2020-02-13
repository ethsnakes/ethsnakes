import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";

export class WaitingLayer extends Phaser.GameObjects.Container {

    private f: number;
    private miningLabel: Phaser.GameObjects.Text;

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

        this.miningLabel = new Phaser.GameObjects.Text(this.scene, 0, 450, "MINING TRANSACTION", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "40px", color: "#FFFFFF"});
        this.miningLabel.setOrigin(.5);
        scaledItemsContainer.add(this.miningLabel);

        const infoLabelSmartContract = new Phaser.GameObjects.Text(this.scene, 0, 520, "Transaction hash", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelSmartContract.setOrigin(.5);
        infoLabelSmartContract.scaleX = GameVars.scaleX;
        scaledItemsContainer.add(infoLabelSmartContract);

        const style = {fontFamily: "RussoOne", fontSize: "22px", color: "#00FFFF"};
        const styleOver = { fill: "#FF00FF"};

        const transactionHashShortened = GameVars.transactionHash.slice(0, 6) + "..." + GameVars.transactionHash.slice(GameVars.transactionHash.length - 5, GameVars.transactionHash.length);

        const smartContractLabel = new Phaser.GameObjects.Text(this.scene, 0, 560, transactionHashShortened, {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "32px", color: "#00FFFF"});
        smartContractLabel.setOrigin(.5);
        smartContractLabel.scaleX = GameVars.scaleX;
        smartContractLabel.setInteractive();

        smartContractLabel.on("pointerover", function (): void {
            smartContractLabel.setStyle(styleOver);
          });
        smartContractLabel.on("pointerout", function (): void {
            smartContractLabel.setStyle(style);
          });
        smartContractLabel.on("pointerdown", function (): void {
            window.open(" https://etherscan.io/tx/" + GameVars.transactionHash);
          }, this);

        scaledItemsContainer.add(smartContractLabel);

        const infoLabelTime = new Phaser.GameObjects.Text(this.scene, 0, 650, "This operation takes in average 15 seconds, please be patient.", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelTime.setOrigin(.5);
        infoLabelTime.scaleX = GameVars.scaleX;
        scaledItemsContainer.add(infoLabelTime);
    }

    public update(): void {

        this.f ++;

        if (this.f % 25 === 0) {
            this.miningLabel.alpha = this.miningLabel.alpha === 1 ? .5 : 1;
        }
    }
}
