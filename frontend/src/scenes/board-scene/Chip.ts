import { BoardContainer } from "./BoardContainer";
import { BoardManager } from "./BoardManager";
import { start } from "repl";

export class Chip extends Phaser.GameObjects.Container {

    private static readonly LADDER_SPEED = .25;

    public i: number;

    private shadow: Phaser.GameObjects.Image;
    private chip: Phaser.GameObjects.Image;
    private isPlayer: boolean; 
    private goalCell: number;
    private origY: number;

    constructor(scene: Phaser.Scene, color: number, isPlayer: boolean) {

        super(scene);

        this.i = 0;
        this.isPlayer = isPlayer;

        const p = this.getCellPosition(this.i + 1);

        this.x = p.x - BoardContainer.CELL_SIZE;
        this.y = p.y;
 
        this.origY = .85;

        this.shadow = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "player_shadow");
        this.shadow.setOrigin(.5, 0);
        this.add(this.shadow);

        this.chip = new Phaser.GameObjects.Image(this.scene, 0, 0,  "texture_atlas_1", this.isPlayer ? "chip_player" : "chip_bot");
        this.add(this.chip);

        // HAY Q HACER ESTO PQ EL METODO UPDATE NO SE UTILIZA DE MANERA AUTOMATICA
        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        this.chip.setOrigin(.5, this.origY);
    }

    public moveInLadder(i: number): void {
        
        const startPosition = this.getCellPosition(this.i);

        this.i = i;

        const endPosition = this.getCellPosition(this.i);

        const d = Math.sqrt((startPosition.x - endPosition.x) * (startPosition.x - endPosition.x) + (startPosition.y - endPosition.y) * (startPosition.y - endPosition.y));

        const t = d / Chip.LADDER_SPEED;

        this.scene.tweens.add({
            targets: this,
            x: endPosition.x,
            y: endPosition.y,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: t
        });
    }

    public moveInSnake(i: number): void {
        
        this.i = i;

        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 300,
            onComplete: function(): void {

                const endPosition = this.getCellPosition(this.i);
                this.x = endPosition.x;
                this.y = endPosition.y;

                this.scene.tweens.add({
                    targets: this,
                    scaleY: 1,
                    ease: Phaser.Math.Easing.Cubic.Out,
                    duration: 300,
                    delay: 600
                });

            },
            onCompleteScope: this
        });
    }

    public forcePosition(i: number): void {

        this.i = i;

        const p = this.getCellPosition(this.i);
        this.x = p.x;
        this.y = p.y;
    
    }
    public move(i: number): void {

        this.goalCell = i;

        this.i ++;
 
        const p = this.getCellPosition(this.i);
        this.applyTween(p);
    }

    private applyTween(p: {x: number, y: number}): void {
        
        this.scene.tweens.add({
            targets: this,
            x: p.x,
            y: p.y,
            ease: Phaser.Math.Easing.Cubic.InOut,
            duration: 300,
            onComplete: this.onTweeenComplete,
            onCompleteScope: this
        });

        this.scene.tweens.add({
            targets: this,
            origY: 1.15,
            ease: Phaser.Math.Easing.Cubic.InOut,
            duration: 150, 
            yoyo: true
        });
    }

    private onTweeenComplete(): void {

        if (this.i < this.goalCell) {
            this.i ++;
            const p = this.getCellPosition(this.i);
            this.applyTween(p);
        } else {
            BoardManager.chipArrivedToItsPosition(this);
        }
    }

    private getCellPosition(i: number): {x: number, y: number} {

        let x: number;
        let y: number;

        if (Math.floor((i - 1) / 10) % 2 === 0) {
            x = (((i - 1) % 10) - 4.5) * BoardContainer.CELL_SIZE;
        } else {
            x = (4.5 - ((i - 1) % 10)) * BoardContainer.CELL_SIZE;
        }

        y = (4.5 - Math.floor((i - 1) / 10)) * BoardContainer.CELL_SIZE;

        if (this.isPlayer) {
            x += 5;
        } else {
            x -= 5;
            y -= 25;
        }

        return {x: x, y: y};
    }
}
