import { GameConstants } from "../../GameConstants";

export class SplashLayer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene) {

        super(scene);

        const background = new Phaser.GameObjects.Image(this.scene,  GameConstants.GAME_WIDTH / 2, GameConstants.GAME_HEIGHT / 2, "background");
        this.add(background);

        const gameLogo = new Phaser.GameObjects.Image(this.scene,GameConstants.GAME_WIDTH / 2, 325, "game-logo");
        this.add(gameLogo);
    }

    public disappear(): void {

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 450,
            onComplete: function(): void {
                this.destroy();
            },
            onCompleteScope: this
        });
    }
}
