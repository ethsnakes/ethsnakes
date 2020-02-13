# EthSnakes

EthSnakes is a Snake and Ladders descentralized provably fair game running in the Ethereum Blockchain, so players can
be sure that results are not manipulated.

You need Metamask in order to play the game, you can download Metamsk extension for your browser in https://metamask.io/

To start the game, first you will need to add funds, that is as simple as clicking "add funds" blue button and selecting
the amount to play, then Metamask will pop-up to confirm the transaction. Now you can start the game by pressing the
Play button at the bottom left and confirming with Metamask, once the transaction is mined the game will start. If you
win the game, you will win the amount that you had bet and will be added in your balance, which you can withdraw
at any moment by pressing the blue button of "retrieve funds" and confirming with Metamask.

EthSnakes uses some money as collateral in order to pay the users that play in the game. There is never funds from one
player being used to play another player. If the player loses the game, the player loses the bet and the collateral is
expanded, and otherwise if the player wins the game.

Winning at EthSnakes, is almost a 50%/50% winning chance game, just the player that starts has a very small advantage
compared with the second player. So if the user starts, has a small bigger chance to win than the IA. At the beginning
of the game a dice is thrown internally and if it is 1 or 2 the user starts while if it is 3, 4, 5 or 6 the IA
starts. While the IA has a 66% of change to start, that just gives the machine a very very small advantage.

We developed this game with passion for the Ethereum community to enjoy and we hope that you do as much as we did
developing it. Enjoy!

## For developers

### Install

```
npm install -g truffle
npm install -g ganache-cli
npm install
```

### Test

``` 
truffle test
```

### Run

```
ganache-cli --blockTime 1 --gasLimit 15000000 --allowUnlimitedContractSize --host 0.0.0.0 --accounts=10
truffle migrate --reset --network dev
npm run dev
```
