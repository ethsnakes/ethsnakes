import { GameConstants } from "../../../GameConstants";
import { Button } from "../../../utils/Utils";
import { GameVars } from "../../../GameVars";
import { BoardManager } from "../BoardManager";
import { GameManager } from "../../../GameManager";
import { DevelopmentMenu } from "./DevelopmentMenu";

export class GUI extends Phaser.GameObjects.Container {

    private settingsButton: Button;
    private diceButton: Button;
    private addFundsButton: Button;
    private retrieveFundsButton: Button;
    private playButton: Button;
    private diceButtonTween: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene) {

        super(scene);

        const playButtonPosition = {x: GameConstants.GAME_WIDTH - 90 * GameVars.scaleX, y:  GameConstants.GAME_HEIGHT - 110};

        this.playButton = new Button(this.scene, playButtonPosition.x, playButtonPosition.y, "texture_atlas_1", "btn_play_off", "btn_play_on");
        this.playButton.scaleX = GameVars.scaleX;
        this.playButton.onUp(this.onClickPlay, this);
        this.add(this.playButton);

        this.addFundsButton = new Button(this.scene, 530, 40, "texture_atlas_1", "btn_add_funds_off", "btn_add_funds_on");
        this.addFundsButton.scaleX = GameVars.scaleX;
        this.addFundsButton.onUp(this.onClickAddFunds, this);
        this.add(this.addFundsButton);

        this.retrieveFundsButton = new Button(this.scene, 800, 40, "texture_atlas_1", "btn_retrieve_funds_off", "btn_retrieve_funds_on");
        this.retrieveFundsButton.scaleX = GameVars.scaleX;
        this.retrieveFundsButton.onUp(this.onClickRetrieveFunds, this);
        this.add(this.retrieveFundsButton);

        this.settingsButton = new Button(this.scene, GameConstants.GAME_WIDTH - 40 * GameVars.scaleX, 40, "texture_atlas_1", "btn_settings_off", "btn_settings_on");
        this.settingsButton.scaleX = GameVars.scaleX;
        this.settingsButton.onUp(this.onClickSettings, this);
        this.add(this.settingsButton);

        this.diceButton = new Button(this.scene, playButtonPosition.x, playButtonPosition.y, "texture_atlas_1", "btn_dice_off", "btn_dice_on");
        this.diceButton.scaleX = GameVars.scaleX;
        this.diceButton.onUp(this.onClickDiceButton, this);
        this.diceButton.visible = false;
        this.add(this.diceButton);

        if (GameConstants.DEVELOPMENT) {
            const developmentMenu = new DevelopmentMenu(this.scene);
            this.add(developmentMenu);
        }
    }

    public startGame(): void {

        this.playButton.visible = false;
        this.diceButton.visible = true;

        this.addFundsButton.alpha = .375;
        this.retrieveFundsButton.alpha = .375;

        this.addFundsButton.disableInteractive();
        this.retrieveFundsButton.disableInteractive();

        if (GameVars.turn === GameConstants.PLAYER) {

            this.diceButtonTween = this.scene.tweens.add({
                targets: this.diceButton,
                scaleX: 1.05,
                scaleY: 1.05,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 350,
                yoyo: true,
                repeat: -1
            });

        } else {
            this.diceButtonTween = null;
        }
    }

    public disableButtons(): void {

        this.playButton.disableInteractive();
        this.addFundsButton.disableInteractive();
        this.retrieveFundsButton.disableInteractive();
        this.settingsButton.disableInteractive();
        this.diceButton.disableInteractive();
    }

    public enableButtons(): void {

        this.playButton.setInteractive();
        this.addFundsButton.setInteractive();
        this.retrieveFundsButton.disableInteractive();
        this.settingsButton.setInteractive();
        this.diceButton.setInteractive();
    }

    public matchOver(): void {

        this.playButton.visible = true;

        this.addFundsButton.alpha = 1;
        this.addFundsButton.setInteractive();
        
        this.retrieveFundsButton.alpha = 1;
        this.retrieveFundsButton.setInteractive();

        this.diceButton.disableInteractive();

        this.scene.tweens.add({
            targets: this.diceButton,
            alpha: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 300, 
            onComplete: function(): void {
                this.diceButton.visible = false;
            },
            onCompleteScope: this
        });
    }

    private onClickPlay(): void {

        this.playButton.visible = false;
        
        GameManager.play();
    }

    private onClickAddFunds(): void {

        GameManager.addFunds();
    }

    private onClickRetrieveFunds(): void {

        GameManager.retrieveFunds();
    }

    private onClickSettings(): void {
       
        BoardManager.onClickSettings();
    }

    private onClickDiceButton(): void {

        if (GameVars.diceBlocked) {
            return;
        }

        if (this.diceButtonTween) {
            this.diceButtonTween.stop();
            this.diceButtonTween = null;

            this.diceButton.setScale(1);
        }
       
        BoardManager.rollDice();
    }
}
