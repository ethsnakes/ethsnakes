import { AudioManager } from "./AudioManager";

export class Game extends Phaser.Game {

    public static currentInstance: Phaser.Game;

    constructor(config: Phaser.Types.Core.GameConfig) {
        
        super(config);

        Game.currentInstance = this;
    }

    public onBlur(): void {

        super.onBlur();

        AudioManager.onBlur();
    }

    public onFocus(): void {

        super.onFocus();

        AudioManager.onFocus();
    }
}
