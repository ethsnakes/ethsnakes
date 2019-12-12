import { BoardScene } from "../BoardScene";

export class Snake extends Phaser.GameObjects.Container {

    public id: number;
    
    private blinking: boolean;
    private f: number;
    private tBlink: number;
    private snakeSprite: Phaser.GameObjects.Sprite;
    private head: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, id: number) {

        super(scene);

        this.id = id;
        this.blinking = false;
        this.f = 0;
        this.tBlink = 0;
        this.x = -4;
        this.y = -15;

        this.snakeSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "texture_atlas_2", "snake_" + this.id + "_01");

        BoardScene.currentInstance.add.existing(this.snakeSprite);

        this.add(this.snakeSprite);

        this.head = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_2", "snake_" + this.id + "_blink_01");
        this.head.visible = false;
        this.add(this.head);
    }

    public update(): void {

        if (this.blinking) {

            this.f ++;

            if (this.f === 6) {
                this.head.setFrame("snake_" + this.id + "_blink_02");
            }

            if (this.f === 12) {
                this.blinking = false;
                this.head.visible = false;
            }

        } else {

            if (Math.random() > .9985) {

                const t = Date.now();

                if (t - this.tBlink > 6000) {
                    this.blink();
                }
            }
        }
    }

    public swallow(): void {

        this.blinking = false;
        this.tBlink = Date.now(); // para que no parpadee a media animacion

        this.snakeSprite.play("snake_swallow_" +  this.id);
    }

    private blink(): void {
        
        this.blinking = true;
        this.f = 0;

        this.tBlink = Date.now();

        this.head.visible = true;
    }
}

