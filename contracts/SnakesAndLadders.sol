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
    mapping(int8 => int8) private ladders;
    int8 private tiles = 100;  // 1 + 99

    constructor() public {
        // ladders
        ladders[4] = 14;
        ladders[8] = 32;
        ladders[20] = 38;
        ladders[28] = 84;
        ladders[40] = 59;
        ladders[58] = 83;
        ladders[72] = 93;
        // snakes
        ladders[15] = 3;
        ladders[31] = 9;
        ladders[44] = 26;
        ladders[62] = 19;
        ladders[64] = 42;
        ladders[74] = 70;
        ladders[85] = 33;
        ladders[91] = 71;
        ladders[96] = 75;
        ladders[98] = 80;
    }

    /**
     * Avoid sending money directly to the contract
     */
    function() external payable {
        revert("Use addBalance to send money.");
    }

    /**
     * Plays the game
     */
    function play(uint amount) public {
        require(amount > 0, "You must send something to bet");
        require(amount <= balances[msg.sender], "You don't have enough balance");
        require(amount*10 < address(this).balance, "You cannot bet more than 1/10 of this contract balance");
        uint turn = 0;
        bool player = false;  // true if next move is for player, false if for computer
        int8 playerUser = 0;
        int8 playerAI = 0;
        // let's decide who starts
        int8 startDice = random(0);
        if (startDice == 1 || startDice == 2) {
            player = true;
        }
        // make all the moves and emit the results
        while (playerUser != tiles && playerAI != tiles) {
            int8 move = random(turn);
            if (player) {
                playerUser = playerUser + move;
                if (ladders[playerUser] != 0) {
                    playerUser = ladders[playerUser];
                }
                if (playerUser > 100) {
                    playerUser = 100 - (playerUser - 100);
                }
            } else {
                playerAI = playerAI + move;
                if (ladders[playerAI] != 0) {
                    playerAI = ladders[playerAI];
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
     * Returns a random number from 1 to 6
     * TODO better use oraclize
     */
    function random(uint turn) public view returns(int8) {
        return int8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, turn)))%6) + 1;
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
