import { AudioManager } from "./AudioManager";
import { GameVars } from "./GameVars";

export class Game extends Phaser.Game {

    public static currentInstance: Phaser.Game;

    constructor(config: Phaser.Types.Core.GameConfig) {
        
        super(config);

        Game.currentInstance = this;
    }

    public onBlur(): void {

        super.onBlur();

        if (!GameVars.transactionOnCourse) {
            AudioManager.onBlur();
        } 
    }

    public onFocus(): void {

        super.onFocus();

        AudioManager.onFocus();
    }
}
