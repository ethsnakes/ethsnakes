import { BoardContainer } from "./BoardContainer";
import { BoardManager } from "./BoardManager";
import { AudioManager } from "../../AudioManager";

export class Chip extends Phaser.GameObjects.Container {

    private static readonly LADDER_SPEED = .275;

    public cellIndex: number;
    public isPlayer: boolean; 
    public marked: boolean;

    private shadow: Phaser.GameObjects.Image;
    private chip: Phaser.GameObjects.Image;
    private origY: number; // por q no funciona setear el originY
    private i: number;
    private movementCells: number [];
    private marker: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, isPlayer: boolean) {

        super(scene);

        this.cellIndex = 0;
        this.isPlayer = isPlayer;
        this.i = 0;
        this.movementCells = [];
        this.marked = false;

        const p = this.getCellPosition(this.cellIndex + 1);

        this.x = p.x - 2.25 * BoardContainer.CELL_SIZE;
        this.y = p.y;
 
        this.origY = .75;

        this.shadow = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "player_shadow");
        this.shadow.setOrigin(.5, 0);
        this.add(this.shadow);

        this.chip = new Phaser.GameObjects.Image(this.scene, 0, 0,  "texture_atlas_1", this.isPlayer ? "chip_player" : "chip_bot");
        this.add(this.chip);

        this.marker = new Phaser.GameObjects.Image(this.scene, 0, -68, "texture_atlas_1", "arrow");
        this.marker.visible = false;
        this.add(this.marker);

        this.scene.tweens.add({
            targets: this.marker,
            y: -78,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 250,
            yoyo: true,
            repeat: -1
        });
    }

    public update(): void {

        this.chip.setOrigin(.5, this.origY);
    }

    public mark(): void {

        if (this.marked) {
            return;
        }

        this.marked = true;
        this.marker.visible = true;
    }

    public unMark(): void {

        this.marked = false;
        this.marker.visible = false;
    }

    public moveInLadder(goalCellIndex: number): void {
        
        const startPosition = this.getCellPosition(this.cellIndex);

        this.cellIndex = goalCellIndex;

        const endPosition = this.getCellPosition(this.cellIndex);

        const d = Math.sqrt((startPosition.x - endPosition.x) * (startPosition.x - endPosition.x) + (startPosition.y - endPosition.y) * (startPosition.y - endPosition.y));

        const t = d / Chip.LADDER_SPEED;

        this.scene.tweens.add({
            targets: this,
            x: endPosition.x,
            y: endPosition.y,
            ease: Phaser.Math.Easing.Cubic.InOut,
            duration: t,
            onComplete: BoardManager.chipArrivedToItsFinalPosition,
            onCompleteScope: BoardManager
        });

        AudioManager.playSound("ladder_up");
    }

    public moveInSnake(goalCellIndex: number): void {
        
        this.cellIndex = goalCellIndex;

        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 300,
            onComplete: function(): void {

                const endPosition = this.getCellPosition(this.cellIndex);
                this.x = endPosition.x;
                this.y = endPosition.y;

                this.scene.tweens.add({
                    targets: this,
                    scaleY: 1,
                    ease: Phaser.Math.Easing.Elastic.Out,
                    duration: 900,
                    delay: 600,
                    onComplete: BoardManager.chipArrivedToItsFinalPosition,
                    onCompleteScope: BoardManager,
                    onStart: () => {
                        AudioManager.playSound("token_reappears_snakes_ass");
                    },
                    onStartScope: this
                });
            },
            onCompleteScope: this
        });

        AudioManager.playSound("snake_down");
    }

    public forcePosition(goalCellIndex: number): void {

        this.cellIndex = goalCellIndex;

        const p = this.getCellPosition(this.cellIndex);
        this.x = p.x;
        this.y = p.y;
    
    }
    public move(goalCellIndex: number): void {

        // mirar si la casilla es mayor que 100, en tal caso descomponer 
        // en 2 movimientos

        this.movementCells.length = 0;

        for (let i = this.cellIndex + 1; i <= goalCellIndex; i++) {

            if (i <= 100) {
                this.movementCells.push(i);
            } else {
                this.movementCells.push(200 - i);
            }  
        }

        this.cellIndex = goalCellIndex <= 100 ? goalCellIndex : 200 - goalCellIndex;
        this.i = 0;

        const p = this.getCellPosition(this.movementCells[this.i]);
        this.applyTween(p);
    }

    private applyTween(p: {x: number, y: number}): void {
        
        this.scene.tweens.add({
            targets: this,
            x: p.x,
            y: p.y,
            ease: Phaser.Math.Easing.Cubic.InOut,
            duration: 250,
            onComplete: this.onTweeenComplete,
            onCompleteScope: this
        });

        this.scene.tweens.add({
            targets: this,
            origY: 1.15,
            ease: Phaser.Math.Easing.Cubic.InOut,
            duration: 125, 
            yoyo: true
        });

        AudioManager.playSound("token_jumps");
    }

    private onTweeenComplete(): void {

        if (this.i < this.movementCells.length - 1) {
            this.i ++;
            const p = this.getCellPosition(this.movementCells[this.i]);
            this.applyTween(p);
        } else {
            BoardManager.chipArrivedToItsPosition(this);
        }

        AudioManager.playSound("token_lands");
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
            x += 3;
        } else {
            x -= 3;
            y -= 20;
        }

        return {x: x, y: y};
    }
}
