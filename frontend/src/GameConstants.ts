// javascript-obfuscator bundle.js --output bundle.js

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = false;
    public static readonly DEBUG_MODE = false;
    public static readonly VERBOSE = false;

    public static readonly GAME_WIDTH = 1024;
    public static readonly GAME_HEIGHT = 768;

    public static readonly DIFFICULTY_EASY = "easy";
    public static readonly DIFFICULTY_MEDIUM = "medium";
    public static readonly DIFFICULTY_HARD = "hard";

    public static readonly ROWS = 13;
    public static readonly COLS = 11;
    public static readonly CELL_SIZE = GameConstants.GAME_WIDTH / GameConstants.COLS;

    public static readonly BOARD_STATE_PRISTINE = 0;
    public static readonly BOARD_STATE_IN_PROGRESS = 1;
    public static readonly BOARD_STATE_LOST = 2;
    public static readonly BOARD_STATE_WON = 3;

    public static readonly SAVED_GAME_DATA_KEY = "minesweeper-data";
}
