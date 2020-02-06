import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";
import { GameVars } from "../../../GameVars";

export class AmountSelectionButton extends Phaser.GameObjects.Container {

    public value: number;
    
    private offButton: Button;
    private onButton: Button;
    private amountLabel: Phaser.GameObjects.Text;
    
    constructor(scene: Phaser.Scene, value: number) {

        super(scene);

        this.value = value;

        this.offButton = new Button(this.scene, 0, 0, "texture_atlas_1", "tick_mark_0_off", "tick_mark_0_on");
        this.offButton.onUp(this.onClickButton, this);
        this.add(this.offButton);

        this.onButton = new Button(this.scene, 0, 0, "texture_atlas_1", "tick_mark_1_off", "tick_mark_1_on");
        this.onButton.visible = false;
        this.onButton.onUp(this.onClickButton, this);
        this.add(this.onButton);

        this.amountLabel = new Phaser.GameObjects.Text(this.scene, 0, 80, GameVars.formatNumber(value) + " ETH", {fontFamily: "BladiTwo4F", fontSize: "27px", color: "#19D3C5"});
        this.amountLabel.setOrigin(.5);
        this.add(this.amountLabel);
    }

    public activate(): void {

        this.offButton.setInteractive();
        this.offButton.alpha = 1;
        this.amountLabel.alpha = 1;
    }

    public deactivate(): void {

        this.offButton.disableInteractive();
        this.offButton.alpha = .35;
        this.amountLabel.alpha = .35;
    }

    public disableButton(): void {

        this.offButton.visible = true;
        this.onButton.visible = false;
    }

    private onClickButton(): void {
        
        this.offButton.visible = !this.offButton.visible;
        this.onButton.visible = !this.onButton.visible;

        GameManager.onBetSelected(this.value);
    }
}
