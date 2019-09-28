import { BoardContainer } from "./BoardContainer";

export class Chip extends Phaser.GameObjects.Container {

    private shadow: Phaser.GameObjects.Image;
    private chip: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, color: number, player: string) {

        super(scene);
    }

    public moveToCell(i:  number): void {
        //
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
