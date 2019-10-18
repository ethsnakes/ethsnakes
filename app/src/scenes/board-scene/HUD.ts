import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private balanceLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "top_bar");
        background.setOrigin(0);
        this.add(background);

        const yourBalanceLabel = new Phaser.GameObjects.Text(this.scene, 10, 15, "YOUR BALANCE:", {fontFamily: "RussoOne", fontSize: "40px", color: "#000000"});
        yourBalanceLabel.scaleX = GameVars.scaleX;
        this.add(yourBalanceLabel);

        this.balanceLabel = new Phaser.GameObjects.Text(this.scene, (yourBalanceLabel.x + yourBalanceLabel.width + 20) * GameVars.scaleX, yourBalanceLabel.y, GameVars.balance + " ETH" , {fontFamily: "RussoOne", fontSize: "40px", color: "#000000"});
        this.balanceLabel.scaleX = GameVars.scaleX;
        this.add(this.balanceLabel);
    }
}
