pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SnakesAndLadders is Ownable {
    using SafeMath for uint;
    using SafeMath for uint8;

    // All balances
    mapping(address => uint) private balances;

    // Log movement
    event LogMove(address sender, uint turn, bool player, int move);
    event LogGame(address sender, bool result);
    event LogFund(address sender, uint amount);
    event LogWithdraw(address sender, uint amount);
    event LogAddBalance(address sender, uint amount);
    event LogRemoveBalance(address sender, uint amount);

    // Game composition
    mapping(int8 => int8) private ladders;
    int8 private tiles = 99;  // 1 + 99

    constructor() public {
        ladders[1] = 37;
        ladders[3] = 11;
        ladders[9] = 22;
        ladders[32] = 53;
        ladders[50] = -39;
        ladders[51] = 37;
        ladders[55] = -40;
        ladders[61] = -4;
        ladders[79] = 20;
        ladders[91] = -38;
        ladders[98] = -90;
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
        bool player = true;  // true if next move is for player, false if for computer
        int8 player1 = 0;
        int8 player2 = 0;
        // let's decide who starts
        int8 startDice = random(0);
        if (startDice == 5 || startDice == 6) {
            player = false;
        }
        // make all the moves and emit the results
        while (player1 < tiles && player2 < tiles) {
            int8 move = random(turn);
            if (player) {
                player1 = player1 + move;
                player1 = player1 + ladders[player1];
            } else {
                player2 = player2 + move;
                player2 = player2 + ladders[player2];
            }
            emit LogMove(msg.sender, turn, player, move);
            player = !player;
            turn++;
        }
        if (player2 >= tiles) {
            emit LogGame(msg.sender, false);
        } else {
            balances[msg.sender] += amount*2;
            emit LogGame(msg.sender, true);
        }
    }

    /**
     * Returns a random number from 1 to 6
     * TODO better use oraclize
     */
    function random(uint turn) public view returns(int8) {
        return int8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, turn)))%6);
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
     * Get the balance of an user
     */
    function getBalance() public view returns(uint) {
        return balances[msg.sender];
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
    function withdrawFunds() public onlyOwner {
        require(address(this).balance > 0, "There is no balance to withdraw");
        emit LogRemoveBalance(msg.sender, address(this).balance);
        msg.sender.transfer(address(this).balance);
    }
}

