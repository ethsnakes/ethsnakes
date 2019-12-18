import { GameConstants } from "../../../GameConstants";
import { BetSelectionButton } from "./BetSelectionButton";
import { GameVars } from "../../../GameVars";

export class BetSelectionButtonsContainer extends Phaser.GameObjects.Container {

    private buttons: BetSelectionButton[];
    private outcomeLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 300;

        this.buttons = [];

        const infoLabelBet = new Phaser.GameObjects.Text(this.scene, 0, -115, "SELECT YOUR BET", {fontFamily: "BladiTwoCondensedComic4F-Bold", fontSize: "50px", color: "#FEB403"});
        infoLabelBet.setOrigin(.5);
        this.add(infoLabelBet);

        const deltaButton = 180;

        for (let i = 0; i < GameConstants.STAKES_IN_WEIS.length; i ++) {
            const b = new BetSelectionButton(this.scene, GameConstants.STAKES_IN_WEIS[i]);
            b.x = ((-GameConstants.STAKES_IN_WEIS.length * .5) + .5 + i) * deltaButton;
            this.add(b);

            this.buttons.push(b);
        }

        this.outcomeLabel = new Phaser.GameObjects.Text(this.scene, 0, 145, "IF YOU WIN YOU'LL GET", {fontFamily: "BladiTwo4F", fontSize: "26px", color: "#FFFFFF"});
        this.outcomeLabel.visible = false;
        this.outcomeLabel.setOrigin(.5);
        this.add(this.outcomeLabel );
    }

    public betSelected(value: number): void {

        this.outcomeLabel.visible = true;
        this.outcomeLabel.text =  "IF YOU WIN YOU'LL GET " + GameVars.formatNumber(2 * value) + " wei";

        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].name !== value.toString()) {
                this.buttons[i].disableButton();
            } 
        }
    }
}
