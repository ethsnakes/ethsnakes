import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";

export class HUD extends Phaser.GameObjects.Container {

    private minesLabel: Phaser.GameObjects.BitmapText;
    private timeLabel: Phaser.GameObjects.BitmapText;

    constructor(scene: Phaser.Scene) {

        super(scene);

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = 20;

        const capsuleWidth = 58;
        const capsuleHeight = 24;

        const minesCapsule = new Phaser.GameObjects.Graphics(this.scene);
        minesCapsule.x = -86;
        minesCapsule.y = -2;
        minesCapsule.fillStyle(0x000000);
        minesCapsule.fillRect(-capsuleWidth / 2, -capsuleHeight / 2, capsuleWidth, capsuleHeight);
        this.add(minesCapsule);

        this.minesLabel = new Phaser.GameObjects.BitmapText(this.scene, minesCapsule.x - 1, minesCapsule.y + 1, "russo-one-red", "", 24);
        this.minesLabel.setOrigin(.5);
        this.minesLabel.visible = false;
        this.add(this.minesLabel);

        const timeCapsule = new Phaser.GameObjects.Graphics(this.scene);
        timeCapsule.x = 86;
        timeCapsule.y = -2;
        timeCapsule.fillStyle(0x000000);
        timeCapsule.fillRect(-capsuleWidth / 2, -capsuleHeight / 2, capsuleWidth, capsuleHeight);
        this.add(timeCapsule);

        this.timeLabel = new Phaser.GameObjects.BitmapText(this.scene, timeCapsule.x - 1, timeCapsule.y + 1, "russo-one-red", "", 24);
        this.timeLabel.setOrigin(.5);
        this.timeLabel.visible = false;
        this.add(this.timeLabel);

        this.scene.time.addEvent({delay: 200, callback: function(): void {
            this.minesLabel.visible = true;
            this.minesLabel.text = GameVars.formatNumber(GameVars.mines);
            this.timeLabel.visible = true;
            this.timeLabel.text = "000";
        }, callbackScope: this});
    }

    public updateTimer(): void {

        if (GameVars.time < 999) {
            this.timeLabel.text = GameVars.formatNumber(GameVars.time);
        }
    }
}
