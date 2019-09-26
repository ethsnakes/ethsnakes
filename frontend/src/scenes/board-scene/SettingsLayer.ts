import { GameConstants } from "../../GameConstants";

export class SettingsLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        const darkLayer = new Phaser.GameObjects.Graphics(this.scene);
        darkLayer.fillStyle(0x000000, .65);
        darkLayer.fillRect(0, 0, GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT);
        this.add(darkLayer);
    }
}
