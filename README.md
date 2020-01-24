# Eth Snakes and Ladders

## Install

```
npm install -g truffle
npm install -g ganache-cli
npm install
```

## Test

``` 
truffle test
```

## Run

```
ganache-cli --blockTime 1 --gasLimit 15000000 --allowUnlimitedContractSize --host 0.0.0.0 --accounts=10
```

```
ganache-cli --gasLimit 15000000 --allowUnlimitedContractSize --host 0.0.0.0 --accounts=10
truffle migrate --reset --network dev
npm run dev
```
