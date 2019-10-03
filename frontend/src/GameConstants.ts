// javascript-obfuscator bundle.js --output bundle.js

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = true;
    public static readonly DEBUG_MODE = false;
    public static readonly VERBOSE = false;

    public static readonly GAME_WIDTH = 1024;
    public static readonly GAME_HEIGHT = 768;

    public static readonly BOT = "bot";
    public static readonly PLAYER = "player";

    public static readonly BOARD_ELEMENTS: {in: number, out: number} [] = [
        // ESCALERAS
        {in: 4, out: 14},
        {in: 8, out: 32},
        {in: 20, out: 38},
        {in: 28, out: 84},
        {in: 40, out: 59},
        {in: 58, out: 83},
        {in: 72, out: 93},
        // serpientes
        {in: 15, out: 3},
        {in: 31, out: 9},
        {in: 44, out: 26},
        {in: 62, out: 19},
        {in: 64, out: 42},
        {in: 74, out: 70},
        {in: 85, out: 33},
        {in: 91, out: 71},
        {in: 96, out: 75},
        {in: 98, out: 80}
    ];

    public static readonly SAVED_GAME_DATA_KEY = "snake-and-ladders-data";
}
