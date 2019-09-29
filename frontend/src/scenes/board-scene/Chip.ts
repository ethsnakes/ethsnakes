import { BoardContainer } from "./BoardContainer";

export class Chip extends Phaser.GameObjects.Container {

    private shadow: Phaser.GameObjects.Image;
    private chip: Phaser.GameObjects.Image;
    private isPlayer: boolean;
    private i: number;

    constructor(scene: Phaser.Scene, color: number, isPlayer: boolean) {

        super(scene);

        this.i = -1;

        this.isPlayer = isPlayer;

        this.shadow = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "player_shadow");
        this.add(this.shadow);

        this.chip = new Phaser.GameObjects.Image(this.scene, 0, 0, "texture_atlas_1", "chip_player");
        this.chip.setOrigin(.5, .85);
        this.add(this.chip);
    }

    public moveToCell(i:  number): void {

        this.i = i;
        
        const p = this.getCellPosition(i);

        this.chip.x = p.x;
        this.chip.y = p.y;

        this.shadow.x = this.chip.x;
        this.shadow.y = this.chip.y + 10;
    }

    private getCellPosition(i: number): {x: number, y: number} {

        let x: number;

        if (Math.floor((i - 1) / 10) % 2 === 0) {
            x = (((i - 1) % 10) - 4.5) * BoardContainer.CELL_SIZE;
        } else {
            x = (4.5 - ((i - 1) % 10)) * BoardContainer.CELL_SIZE;
        }

        const y = (4.5 - Math.floor((i - 1) / 10)) * BoardContainer.CELL_SIZE + BoardContainer.CELL_SIZE * .2;

        return {x: x, y: y};
    }
}
