import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private balanceLabel: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFF00, .65);
        background.fillRect(0, 0, GameConstants.GAME_WIDTH, 75);
        this.add(background);

        const yourBalanceLabel = new Phaser.GameObjects.Text(this.scene, 10, 5, "YOUR BALANCE:", {fontFamily: "RussoOne", fontSize: "40px", color: "#000000"});
        yourBalanceLabel.scaleX = GameVars.scaleX;
        this.add(yourBalanceLabel);

        this.balanceLabel = new Phaser.GameObjects.Text(this.scene, (yourBalanceLabel.x + yourBalanceLabel.width + 20) * GameVars.scaleX, 5, GameVars.balance + " ETH" , {fontFamily: "RussoOne", fontSize: "40px", color: "#000000"});
        this.balanceLabel.scaleX = GameVars.scaleX;
        this.add(this.balanceLabel);
    }
}
