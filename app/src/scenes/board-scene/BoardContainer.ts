import { GameConstants } from "../../GameConstants";
import { GameVars } from "../../GameVars";
import { Chip } from "./Chip";
import { Snake } from "./Snake";
import { BoardScene } from "./BoardScene";

export class BoardContainer extends Phaser.GameObjects.Container {

    public static readonly CELL_SIZE = 57.5;

    public static currentInstance: BoardContainer;

    private playerChip: Chip;
    private botChip: Chip;
    private woodSupport: Phaser.GameObjects.Image;
    private moves: number;
    private snakes: Snake[];
    private laddersFx: Phaser.GameObjects.Sprite[];

    constructor(scene: Phaser.Scene) {

        super(scene);

        BoardContainer.currentInstance = this;

        this.x = GameConstants.GAME_WIDTH / 2;
        this.y = 450;
        this.scaleX = GameVars.scaleX;
        this.moves = 0;
        this.snakes = [];
        this.laddersFx = [];

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

        this.addLaddersFx();

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

    public onTurnChanged(): void {

        if (GameVars.currentTurn === GameConstants.PLAYER) {
            this.playerChip.mark();
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

    public playLadderFx(anims: number[]): void {

        for (let i = 0; i < this.laddersFx.length; i++) {
            for (let j = 0; j < anims.length; j++) {
                if (anims[j] === i) {
                    this.laddersFx[i].visible = true;
                    this.laddersFx[i].anims.play("stairs_fx");
                }
            }
        }
    }

    private addSnakes(): void {
        
        for (let i = 1; i <= 8; i ++) {
            const snake = new Snake(this.scene, i);
            this.add(snake);

            this.snakes.push(snake);
        }
    }

    private addLaddersFx(): void {

        let fx = new Phaser.GameObjects.Sprite(this.scene, 0, 237, "texture_atlas_1", "stairs_fx_01");
        fx.angle = 70;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, 177, 168, "texture_atlas_1", "stairs_fx_01");
        fx.angle = 18;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, -207, 150, "texture_atlas_1", "stairs_fx_01");
        fx.angle = 42;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, 102, 70, "texture_atlas_1", "stairs_fx_01");
        fx.angle = -34;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, 28, -40, "texture_atlas_1", "stairs_fx_01");
        fx.angle = -34;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, -45, -150, "texture_atlas_1", "stairs_fx_01");
        fx.angle = -34;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, -235, 30, "texture_atlas_1", "stairs_fx_01");
        fx.angle = 25;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, -146, -120, "texture_atlas_1", "stairs_fx_01");
        fx.angle = 0;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        fx = new Phaser.GameObjects.Sprite(this.scene, 175, -210, "texture_atlas_1", "stairs_fx_01");
        fx.angle = -24;
        fx.visible = false;
        BoardScene.currentInstance.add.existing(fx);
        this.add(fx);
        this.laddersFx.push(fx);

        for (let i = 0; i < this.laddersFx.length; i ++) {
            this.laddersFx[i].on("animationcomplete", () => {
                this.laddersFx[i].visible = false;
            }, this);
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
