import { Button } from "../../../utils/Utils";
import { GameVars } from "../../../GameVars";
import { AudioManager } from "../../../AudioManager";

export class AudioButton extends Phaser.GameObjects.Container {

    private audioOnButton: Button;
    private audioOffButton: Button;
    
    constructor(scene: Phaser.Scene) {

        super(scene);

        this.audioOnButton = new Button(this.scene, 0, 0, "texture_atlas_1", "btn_sound_on", "btn_sound_on_on");
        this.audioOnButton.onDown(this.onClickAudioButton, this);
        this.audioOnButton.setScrollFactor(0);
        this.add(this.audioOnButton);

        this.audioOffButton = new Button(this.scene, 0, 0, "texture_atlas_1", "btn_sound_off", "btn_sound_off_on");
        this.audioOffButton.onDown(this.onClickAudioButton, this);
        this.audioOffButton.setScrollFactor(0);
        this.add(this.audioOffButton);

        if (GameVars.gameData.muted) {
            this.audioOnButton.visible = false;
            this.audioOffButton.visible = true;
        } else {
            this.audioOnButton.visible = true;
            this.audioOffButton.visible = false;
        }
    }

    private onClickAudioButton(): void {

        AudioManager.toggleAudioState();

        if (GameVars.gameData.muted) {
            this.audioOnButton.visible = false;
            this.audioOffButton.visible = true;
        } else {
            this.audioOnButton.visible = true;
            this.audioOffButton.visible = false;
        }
    }
}
