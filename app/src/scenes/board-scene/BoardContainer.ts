import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { Chip } from "./Chip";
import { Snake } from "./Snake";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly CELL_SIZE = 57.5;

    public static currentInstance: BoardContainer;

    private playerChip: Chip;
    private botChip: Chip;
    private woodSupport: Phaser.GameObjects.Image;
    private moves: number;
    private snakes: Snake[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = 450;
        this.scaleX = GameVars.scaleX;
        this.moves = 0;
        this.snakes = [];

        this.woodSupport = new Phaser.GameObjects.Image(this.scene, -380, 250, "texture_atlas_1", "wood_support");
        this.add(this.woodSupport);

        const boardBackground = new Phaser.GameObjects.Image(this.scene, -8, -2, "texture_atlas_1", "board");
        this.add(boardBackground);

        if (GameConstants.DEBUG_MODE) {
            this.drawGrid();
        }

        const laddersBehind = new Phaser.GameObjects.Image(this.scene, -4, -2, "texture_atlas_1", "ladders_back");
        this.add(laddersBehind);

        this.addSnakes();

        const laddersFront = new Phaser.GameObjects.Image(this.scene, -4, -2, "texture_atlas_1", "ladders_front");
        this.add(laddersFront);

        this.botChip = new Chip(this.scene, false);
        this.add(this.botChip);

        this.playerChip = new Chip(this.scene, true);
        this.add(this.playerChip);
    }

    public update(): void {

        this.botChip.update();
        this.playerChip.update();

        if (this.botChip.y > this.playerChip.y) {
            this.bringToTop(this.botChip);
        } else {
            this.bringToTop(this.playerChip);
        }

        this.snakes.forEach(function (snake: Snake): void {
            snake.update();
        }, this);
    }

    public startMatch(): void {
        
        if (GameVars.currentTurn === GameConstants.PLAYER) {
            this.playerChip.mark();
        } else {
            this.botChip.mark();
        }
    }

    public moveChip(): void {

        let i: number;
        let chip: Chip;

        if (GameVars.currentTurn === GameConstants.PLAYER) {
            chip = this.playerChip;
        } else {
            chip = this.botChip;
        }

        if (chip.marked) {
            chip.unMark();
        }

        i = chip.cellIndex + GameVars.diceResult;
        chip.move(i);

        this.moves ++;

        if (this.moves === 2) {
            // retiramos el soporte de las fichas
            this.scene.tweens.add({
                targets: this.woodSupport,
                x: this.woodSupport.x + 140,
                ease: Phaser.Math.Easing.Cubic.Out,
                delay: 500,
                duration: 500,
                onComplete: function(): void {
                    this.woodSupport.destroy();
                },
                onCompleteScope: this
            });
        }
    }

    public snakeEatsChip(chip: Chip, boardElement: {in: number, out: number, id: number} ): void {
        
        chip.moveInSnake(boardElement.out);

        // pillar la serpiente y mover 
        const snakeID = boardElement.id;
        const snake = this.snakes[snakeID - 1];
        snake.swallow();
    }

    private addSnakes(): void {
        
        for (let i = 1; i <= 8; i ++) {
            const snake = new Snake(this.scene, i);
            this.add(snake);

            this.snakes.push(snake);
        }
    }

    private drawGrid(): void {

        const grid = new Phaser.GameObjects.Graphics(this.scene);
        this.add(grid);

        grid.lineStyle(1, 0x0000FF);

        // las horizontales
        for (let i = 0; i < 11; i ++) {
            grid.moveTo(-BoardContainer.CELL_SIZE * 5, -BoardContainer.CELL_SIZE * (i - 5));
            grid.lineTo(BoardContainer.CELL_SIZE * 5, -BoardContainer.CELL_SIZE * (i - 5));
        }

        for (let i = 0; i < 11; i ++) {
            grid.moveTo( -BoardContainer.CELL_SIZE * (i - 5), -BoardContainer.CELL_SIZE * 5);
            grid.lineTo(-BoardContainer.CELL_SIZE * (i - 5), BoardContainer.CELL_SIZE * 5);
        }

        grid.stroke();
    }
}
