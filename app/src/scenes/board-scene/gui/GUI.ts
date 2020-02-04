import { GameConstants } from "../../../GameConstants";
import { Button } from "../../../utils/Utils";
import { GameVars } from "../../../GameVars";
import { BoardManager } from "../BoardManager";
import { GameManager } from "../../../GameManager";
import { DevelopmentMenu } from "./DevelopmentMenu";
import { AudioButton } from "./AudioButton";
import { AudioManager } from "../../../AudioManager";

export class GUI extends Phaser.GameObjects.Container {

    private infoButton: Button;
    private audioButton: AudioButton;
    private diceButton: Button;
    private addFundsButton: Button;
    private retrieveFundsButton: Button;
    private playButton: Button;
    private diceButtonTween: Phaser.Tweens.Tween;
    private addFundsTween: Phaser.Tweens.Tween;
  
    constructor(scene: Phaser.Scene) {

        super(scene);

        this.visible = false;
        this.addFundsTween = null;

        const playButtonPosition = {x: GameConstants.GAME_WIDTH - 90 * GameVars.scaleX, y:  GameConstants.GAME_HEIGHT - 110};

        this.playButton = new Button(this.scene, playButtonPosition.x, playButtonPosition.y, "texture_atlas_1", "btn_play_off", "btn_play_on");
        this.playButton.scaleX = GameVars.scaleX;
        this.playButton.onDown(this.onClickPlay, this);
        this.add(this.playButton);

        this.addFundsButton = new Button(this.scene, 510, 40, "texture_atlas_1", "btn_add_funds_off", "btn_add_funds_on");
        this.addFundsButton.scaleX = GameVars.scaleX;
        this.addFundsButton.onUp(this.onClickAddFunds, this);
        this.add(this.addFundsButton);

        this.retrieveFundsButton = new Button(this.scene, 740, 40, "texture_atlas_1", "btn_retrieve_funds_off", "btn_retrieve_funds_on");
        this.retrieveFundsButton.scaleX = GameVars.scaleX;
        this.retrieveFundsButton.onUp(this.onClickWithdrawFunds, this);
        this.add(this.retrieveFundsButton);

        this.infoButton = new Button(this.scene, GameConstants.GAME_WIDTH - 110 * GameVars.scaleX, 40, "texture_atlas_1", "btn_info_off", "btn_info_on");
        this.infoButton.scaleX = GameVars.scaleX;
        this.infoButton.onUp(this.onClickInfo, this);
        this.add(this.infoButton);

        this.audioButton = new AudioButton(this.scene);
        this.audioButton.scaleX = GameVars.scaleX;
        this.audioButton.setPosition(GameConstants.GAME_WIDTH - 40, 40);
        this.add(this.audioButton);

        this.diceButton = new Button(this.scene, playButtonPosition.x, playButtonPosition.y, "texture_atlas_1", "btn_dice_off", "btn_dice_on");
        this.diceButton.scaleX = GameVars.scaleX;
        this.diceButton.onDown(this.onClickDiceButton, this);
        this.diceButton.visible = false;
        this.add(this.diceButton);

        if (GameConstants.DEVELOPMENT) {
            const developmentMenu = new DevelopmentMenu(this.scene);
            this.add(developmentMenu);
        }
    }

    public onBalanceAvailable(): void {

        this.visible = true;

        if (GameVars.balance === 0) {

            this.addFundsTween = this.scene.tweens.add({
                targets: this.addFundsButton,
                scaleX: 1.05 * GameVars.scaleX,
                scaleY: 1.05,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 350,
                yoyo: true,
                repeat: -1
            });

            this.retrieveFundsButton.disableInteractive();
            this.retrieveFundsButton.alpha = .35;

            this.playButton.disableInteractive();
            this.playButton.alpha = .35;

        } else {

            if (this.addFundsTween) {
                this.addFundsTween.stop();
                this.addFundsTween = null;
                this.addFundsButton.setScale(GameVars.scaleX, 1);
            }

            if (this.retrieveFundsButton.alpha === .35) {
                this.retrieveFundsButton.setInteractive();
                this.retrieveFundsButton.alpha = 1;
            }

            if (this.playButton.alpha === .35) {
                this.playButton.setInteractive();
                this.playButton.alpha = 1;
            }

            this.scene.tweens.add({
                        targets: this.playButton,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        ease: Phaser.Math.Easing.Cubic.Out,
                        duration: 350,
                        yoyo: true,
                        repeat: -1
                    });
        }
    }

    public startMatch(): void {

        this.playButton.visible = false;
        
        this.addFundsButton.alpha = .375;
        this.retrieveFundsButton.alpha = .375;

        this.addFundsButton.disableInteractive();
        this.retrieveFundsButton.disableInteractive();

        if (GameVars.currentTurn === GameConstants.PLAYER) {

            this.diceButtonTween = this.scene.tweens.add({
                targets: this.diceButton,
                scaleX: 1.05,
                scaleY: 1.05,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 350,
                yoyo: true,
                repeat: -1
            });

            this.diceButton.visible = true;

        } else {
            
            this.diceButtonTween = null;
            this.diceButton.visible = false;
        }
    }

    public onTurnChanged(): void {

        if (GameVars.currentTurn === GameConstants.PLAYER) {

            this.diceButton.visible = true;
            
            this.scene.tweens.add({
                targets: this.diceButton,
                alpha: 1,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 300
            });
        }
    }

    public disableButtons(): void {

        this.playButton.disableInteractive();
        this.addFundsButton.disableInteractive();
        this.retrieveFundsButton.disableInteractive();
        this.infoButton.disableInteractive();
        this.diceButton.disableInteractive();
    }

    public enableButtons(): void {

        this.playButton.setInteractive();
        this.addFundsButton.setInteractive();
        this.retrieveFundsButton.disableInteractive();
        this.infoButton.setInteractive();
        this.diceButton.setInteractive();
    }

    public matchOver(): void {

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

        AudioManager.playSound("click");
    }

    private onClickAddFunds(): void {

        GameManager.onClickAddFunds();

        AudioManager.playSound("click");
    }

    private onClickWithdrawFunds(): void {

        GameManager.withdrawFunds();

        AudioManager.playSound("click");
    }

    private onClickInfo(): void {
       
        BoardManager.showInfoLayer();

        AudioManager.playSound("click");
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
       
        BoardManager.rollDice();

        AudioManager.playSound("click");
    }
}
