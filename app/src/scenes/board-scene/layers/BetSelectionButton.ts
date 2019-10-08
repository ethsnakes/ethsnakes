import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";
import { GameVars } from "../../../GameVars";

export class BetSelectionButton extends Phaser.GameObjects.Container {

    private offButton: Button;
    private onButton: Button;

    constructor(scene: Phaser.Scene, value: number) {

        super(scene);

        this.name = value.toString();

        this.offButton = new Button(this.scene, 0, 0, "texture_atlas_1", "button-radio-green-off", "button-radio-green-off");
        this.offButton.onUp(this.onClickButton, this);
        this.add(this.offButton);

        this.onButton = new Button(this.scene, 0, 0, "texture_atlas_1", "button-radio-green-on", "button-radio-green-on");
        this.onButton.visible = false;
        this.onButton.onUp(this.onClickButton, this);
        this.add(this.onButton);

        const infoLabelBet = new Phaser.GameObjects.Text(this.scene, 0, 80, GameVars.formatNumber(value) + " wei", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelBet.setOrigin(.5);
        this.add(infoLabelBet);
    }

    public disableButton(): void {

        this.offButton.visible = true;
        this.onButton.visible = false;
    }

    private onClickButton(): void {
        
        this.offButton.visible = !this.offButton.visible;
        this.onButton.visible = !this.onButton.visible;

        GameManager.onBetSelected(parseInt(this.name));
    }
}
