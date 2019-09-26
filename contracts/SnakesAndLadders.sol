pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SnakesAndLadders is Ownable {
    using SafeMath for uint;
    using SafeMath for uint8;

    // All balances
    mapping(address => uint) public balances;

    // Log movement
    event LogMove(uint sender, uint turn, bool player, uint move);
    event LogGame(uint sender, bool result);

    // Game composition
    mapping(uint8 => uint8) private ladders;
    uint8 private tiles = 99;  // 1 + 99

    function _constructor() {
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
     * Plays the game
     */
    function play() public payable {
        require(msg.value > 0, "You must send something to bet");
        require(msg.value*10 < address(this).balance, "You cannot bet more than 1/10 of this contract balance");
        uint turn = 0;
        bool player = true;  // true if next move is for player, false if for computer
        uint player1 = 0;
        uint player2 = 0;
        // let's decide who starts
        uint startDice = random(-1);
        if (startDice == 5 || startDice == 6) {
            player = false;
        }
        // make all the moves and emit the results
        while (player1 < tiles && player2 < tiles) {
            move = random(turn);
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
            balances[msg.sender] += msg.value*2;
            emit LogGame(msg.sender, true);
        }
    }

    /**
     * Returns a random number from 1 to 6
     */
    function random(uint turn) public view returns(uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty, turn))%6);
        /*
        bytes32 rngId = oraclize_query(
            "nested",
            "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"serialNumber\",\"data\"]', '\\n{\"jsonrpc\":\"2.0\",\"method\":\"generateSignedIntegers\",\"params\":{\"apiKey\":${[decrypt] BKg3TCs7lkzNr1kR6pxjPCM2SOejcFojUPMTOsBkC/47HHPf1sP2oxVLTjNBu+slR9SgZyqDtjVOV5Yzg12iUkbubp0DpcjCEdeJTHnGwC6gD729GUVoGvo96huxwRoZlCjYO80rWq2WGYoR/LC3WampDuvv2Bo=},\"n\":1,\"min\":1,\"max\":100,\"replacement\":true,\"base\":10${[identity] \"}\"},\"id\":1${[identity] \"}\"}']",
            gasForOraclize
        );
        */
    }

    /**
     * Withdraw the funds
     */
    function withdraw() public {
        uint toWithdraw = balances[msg.sender];
        require(toWithdraw > 0, "There is no balance to withdraw");
        emit LogWithdraw(msg.sender, toWithdraw);
        balances[msg.sender] = 0;
        msg.sender.transfer(toWithdraw);
    }
}

