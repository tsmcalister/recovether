# Deploy Contracts with Truffle

First make sure geth, or another ethereum client is running and unlock your contract account:

./geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock=<"someaccounthexstring">

Install truffle with 

`npm install -g truffle`

Then navigate to the SmartContracts folder and edit the triage.js file to include your account. Then type

`truffle compile`

`truffle migrate`

Your account needs enough gas to be able to deploy the contract. Use the [Rinkeby Faucet](https://faucet.rinkeby.io/) to get funds. 
