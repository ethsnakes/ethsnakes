export class Game extends Phaser.Game {

    public static currentInstance: Phaser.Game;

    constructor(config: Phaser.Types.Core.GameConfig) {
        
        super(config);

        Game.currentInstance = this;

        console.log("MIRAR ANIMACIONS DADOS PARECE QUE LA DEL 1 ESTA MAL Y ACABA SALIENDO UN 5");
    }
}
