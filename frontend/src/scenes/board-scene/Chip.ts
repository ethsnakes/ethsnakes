import { BoardContainer } from "./BoardContainer";

export class Chip extends Phaser.GameObjects.Container {

    private shadow: Phaser.GameObjects.Image;
    private chip: Phaser.GameObjects.Image;
    private isPlayer: boolean;
    private i: number;
    private goalCell: number;
    private origY: number;

    constructor(scene: Phaser.Scene, color: number, isPlayer: boolean) {

        super(scene);

        this.i = 0;

        this.isPlayer = isPlayer;
        this.origY = .85;

        const p = this.getCellPosition(this.i + 1);

        this.shadow = new Phaser.GameObjects.Image(this.scene, p.x - BoardContainer.CELL_SIZE, p.y, "texture_atlas_1", "player_shadow");
        this.shadow.setOrigin(.5, 0);
        this.add(this.shadow);

        this.chip = new Phaser.GameObjects.Image(this.scene, p.x - BoardContainer.CELL_SIZE, p.y, "texture_atlas_1", this.isPlayer ? "chip_player" : "chip_bot");
        this.add(this.chip);

        // HAY Q HACER ESTO PQ EL METODO UPDATE NO SE UTILIZA DE MANERA AUTOMATICA
        this.scene.sys.updateList.add(this);
    }

    public preUpdate(time: number, delta: number): void {

        this.chip.setOrigin(.5, this.origY);
    }

    public moveToCell(i: number): void {

        this.goalCell = i;

        this.i ++;
 
        const p = this.getCellPosition(this.i);
        this.applyTween(p);
    }

    private applyTween(p: {x: number, y: number}): void {
        
        this.scene.tweens.add({
            targets: [this.chip, this.shadow],
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

            console.log("ficha ha llegado");
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

        if (!this.isPlayer) {
            y -= 25;
        }

        return {x: x, y: y};
    }
}
