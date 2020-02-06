import { GameConstants } from "../../../GameConstants";
import { AmountSelectionButton } from "./AmountSelectionButton";
import { GameVars } from "../../../GameVars";

export class AmountSelectionButtonsContainer extends Phaser.GameObjects.Container {

    private buttons: AmountSelectionButton[];
    private outcomeLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 300;

        this.buttons = [];

        let labelStr = GameVars.addingFunds ? "HOW MUCH DO YOU WANT TO ADD?" : "SELECT YOUR BET";

        const infoLabelBet = new Phaser.GameObjects.Text(this.scene, 0, -125, labelStr, {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "66px", color: "#FEB403", align: "center"});
        infoLabelBet.setOrigin(.5);
        infoLabelBet.setWordWrapWidth(800);
        this.add(infoLabelBet);

        const deltaButton = 180;

        for (let i = 0; i < GameConstants.STAKES_IN_ETH.length; i ++) {
            const b = new AmountSelectionButton(this.scene, GameConstants.STAKES_IN_ETH[i]);
            b.x = ((-GameConstants.STAKES_IN_ETH.length * .5) + .5 + i) * deltaButton;
            this.add(b);

            this.buttons.push(b);
        }

        if (GameVars.addingFunds) {

            this.outcomeLabel = null;

        } else if (GameVars.selectingBet) {

            this.outcomeLabel = new Phaser.GameObjects.Text(this.scene, 0, 155, "", {fontFamily: "BladiTwo4F", fontSize: "32px", color: "#FFFFFF"});
            this.outcomeLabel.visible = false;
            this.outcomeLabel.setOrigin(.5);
            this.add(this.outcomeLabel);
        }

        this.deactivateButtons();
    }

    public betSelected(value: number): void {

        if (this.outcomeLabel) {
            this.outcomeLabel.visible = true;
            this.outcomeLabel.text =  "IF YOU WIN YOU'LL GET " + GameVars.formatNumber(2 * value) + " ETH";
        }
        
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].value !== value) {
                this.buttons[i].disableButton();
            } 
        }
    }

    public deactivateButtons(): void {

        for (let i = 0; i < this.buttons.length; i ++) {
            const button = this.buttons[i];
            button.deactivate();
        }
    }

    public activateButtons(): void {

        let minValue = 0;

        if (GameVars.selectingBet) {
            minValue = Math.min(GameVars.balance, GameVars.contractBalance / 5);
        } else if (GameVars.addingFunds) {
            minValue = GameVars.metamaskBalance;
        }

        console.log("balance metamask:", GameVars.metamaskBalance);
        for (let i = 0; i < this.buttons.length; i ++) {

            const button = this.buttons[i];
            
            if (button.value <= minValue) {
                button.activate();
            }
        }
    }
}
