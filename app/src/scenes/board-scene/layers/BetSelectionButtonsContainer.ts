import { GameConstants } from "../../../GameConstants";
import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { GameManager } from "../../../GameManager";

export class BetSelectionButtonsContaienr extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.y = 300;

        const infoLabelBet = new Phaser.GameObjects.Text(this.scene, 0, -100, "Select your bet", {fontFamily: "Arial", fontSize: "30px", color: "#FFFFFF"});
        infoLabelBet.setOrigin(.5);
        this.add(infoLabelBet);

        const b = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "button-radio-green-off");
        this.add(b);
    }
}
