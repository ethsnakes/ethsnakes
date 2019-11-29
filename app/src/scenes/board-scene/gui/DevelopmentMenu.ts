import { GameVars } from "../../../GameVars";
import { Button } from "../../../utils/Utils";
import { BoardManager } from "../BoardManager";
import { GameConstants } from "../../../GameConstants";

export class DevelopmentMenu extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = 90 * GameVars.scaleX;
        this.y = 270;
        this.scaleX = GameVars.scaleX;

        const w = 150;
        const h = 75;

        const background = new Phaser.GameObjects.Graphics(this.scene);
        background.fillStyle(0xFFFFFF);
        background.fillRect(-w / 2, -h / 2, w, h);
        this.add(background);

        const developmentLabel = new Phaser.GameObjects.Text(this.scene, 0, -25, "development menu" , {fontFamily: "Arial", fontSize: "15px", color: "#FF0000"});
        developmentLabel.setOrigin(.5);
        this.add(developmentLabel);

        const winButton = new Button(this.scene, -35, 10, "texture_atlas_1", "btn_force_win_off", "btn_force_win_on");
        winButton.onUp(this.onClickWin, this);
        this.add(winButton);

        const loseButton = new Button(this.scene, 35, 10, "texture_atlas_1", "btn_force_lose_off", "btn_force_lose_on");
        loseButton.onUp(this.onClickLose, this);
        this.add(loseButton);
    }

    private onClickWin(): void {
        
        BoardManager.matchOver(GameConstants.PLAYER);
    }

    private onClickLose(): void {
        
        BoardManager.matchOver(GameConstants.BOT);
    }
}
