pragma solidity 0.5.0;

import "../SnakesAndLadders.sol";

contract SnakesAndLaddersMock is SnakesAndLadders {
    uint nonce = 0;

    function setNonce(uint n) public {
        nonce = n;
    }

    /**
     * Pass parameters to parent
     */
    constructor(address _payout1, address _payout2) public SnakesAndLadders(_payout1, _payout2) {}

    /**
     * Returns a NOT a random number
     */
    function random() public view returns(uint) {
        return uint256(keccak256(abi.encodePacked(nonce)));
    }
}
