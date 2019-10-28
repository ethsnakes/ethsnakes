pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SnakesAndLadders is Ownable {
    using SafeMath for uint;
    using SafeMath for uint8;

    // All balances
    mapping(address => uint) public balances;

    // Player: is true if it's the user, otherwise is the AI
    // Turn: turn of the game starting from 0
    // Move: The dice move from 1 to 6
    event LogMove(address sender, uint turn, bool player, int move);
    event LogGame(address sender, bool result, int balancediff);
    event LogFund(address sender, uint amount);
    event LogWithdraw(address sender, uint amount);
    event LogAddBalance(address sender, uint amount);
    event LogRemoveBalance(address sender, uint amount);

    // Game composition
    mapping(int8 => int8) private boardElements;
    int8 private tiles = 100;  // 1 + 99

    constructor() public {
        // ladders
        boardElements[4] = 14;
        boardElements[8] = 32;
        boardElements[20] = 38;
        boardElements[28] = 84;
        boardElements[40] = 59;
        boardElements[58] = 83;
        boardElements[72] = 93;
        // snakes
        boardElements[15] = 3;
        boardElements[31] = 9;
        boardElements[44] = 26;
        boardElements[62] = 19;
        boardElements[74] = 70;
        boardElements[85] = 33;
        boardElements[91] = 71;
        boardElements[98] = 80;
    }

    /**
     * Avoid sending money directly to the contract
     */
    function() external payable {
        revert("Use addBalance to send money.");
    }

    /**
     * Adds balance and plays a game
     */
    function addAndPlay(uint amount) public payable {
        emit LogFund(msg.sender, msg.value);
        balances[msg.sender] += msg.value;
        play(amount);
    }

    /**
     * Plays the game
     */
    function play(uint amount) public {
        require(amount > 0, "You must send something to bet");
        require(amount <= balances[msg.sender], "You don't have enough balance");
        require(amount*10 < address(this).balance, "You cannot bet more than 1/10 of this contract balance");
        uint randomString = random();
        uint turn = 0;
        bool player = false;  // true if next move is for player, false if for computer
        int8 playerUser = 0;
        int8 playerAI = 0;
        // let's decide who starts
        int8 startDice = randomDice(randomString, 255);
        if (startDice == 1 || startDice == 2) {
            player = true;
        }
        // make all the moves and emit the results
        while (playerUser != tiles && playerAI != tiles) {
            int8 move = randomDice(randomString, turn);
            if (player) {
                playerUser = playerUser + move;
                if (boardElements[playerUser] != 0) {
                    playerUser = boardElements[playerUser];
                }
                if (playerUser > 100) {
                    playerUser = 100 - (playerUser - 100);
                }
            } else {
                playerAI = playerAI + move;
                if (boardElements[playerAI] != 0) {
                    playerAI = boardElements[playerAI];
                }
                if (playerAI > 100) {
                    playerAI = 100 - (playerAI - 100);
                }
            }
            emit LogMove(msg.sender, turn, player, move);
            player = !player;
            turn++;
        }
        if (playerUser == tiles) {
            balances[msg.sender] += amount;
            emit LogGame(msg.sender, true, int(amount));
        } else {
            balances[msg.sender] -= amount;
            emit LogGame(msg.sender, false, -int(amount));
        }
    }

    /**
     * Returns a random number from 1 to 6 based from a uint256 and turn
     */
    function randomDice(uint randomString, uint turn) public pure returns(int8) {
        turn = turn%256;
        return int8(uint8(randomString/2**turn)%6 + 1);
    }

    /**
     * Returns a random uint256
     * TODO better use oraclize
     */
    function random() public view returns(uint256) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
    }

    /**
     * Add to balance
     */
    function addBalance() public payable {
        emit LogFund(msg.sender, msg.value);
        balances[msg.sender] += msg.value;
    }

    /**
     * Withdraw all balance
     */
    function withdrawBalance() public {
        uint toWithdraw = balances[msg.sender];
        require(toWithdraw > 0, "There is no balance to withdraw");
        emit LogWithdraw(msg.sender, toWithdraw);
        balances[msg.sender] = 0;
        msg.sender.transfer(toWithdraw);
    }

    /**
     * Add funds to the contract by the owner
     */
    function addFunds() public payable onlyOwner {
        emit LogAddBalance(msg.sender, msg.value);
    }

    /**
     * Remove funds from the contract by the owner
     */
    function withdrawFunds(uint amount) public onlyOwner {
        require(address(this).balance > 0, "There is no balance to withdraw");
        require(address(this).balance >= amount, "There is not enough balance to withdraw");
        emit LogRemoveBalance(msg.sender, address(this).balance);
        msg.sender.transfer(amount);
    }
}
