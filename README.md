# recovether - Project submission for HackZurich 2017

<img src="/img/logo-banner.png">

recovether is a new cross platform ethereum wallet that interacts with a secure public smart contract to solve the problem of private key loss, by giving the user the ability to redeem his funds with a username-password combination, thereby greatly increasing accesibility to ethereum for the average person. 

# Installation OS X
1. `git clone https://github.com/tsmcalister/recovether.git`
2. `brew update`
3. `brew install geth`
4. `brew install node`
5. `brew install npm`

# Setup
1. `cd recovether`.
2. `npm install`

# Startup
1. Start geth
3. `cd PROJ_DIR`
3. `node index.js?`

# Protocol Explained

This will briefly explain the used protocol and what makes it secure. When signing up 
to the app the user enters his username and password. Once the user deposits funds into the wallet they
are split in 10% normal ETH (retained for gas prices) and 90% the secure ether token. The secure ether is ERC20 like,
but with some extra poperties. Once creation of the tokens is completed the provided password is hashed and then stored
in the blockchain as a hash of a 256 bit salt and itself. The entire data on the chain is then:
```
pubkey | n amount of secure ether | hash(hash(PW) + salt) | salt | hash(username)
```
In normal everyday usage the user can arbitrarily move around secure ether to other secure ether possessors and  move 
it back again to ether with his private key. 

In case the user loses his private key though, he can claim back his lost coins with the following scheme. He first
logs back in to the wallet with his password. Once that is done he creates a new keypair and funds it with about 10% of
the amount he wants to rescue. Once he has done that the wallet will ask to change his password. During this process it
also generates a new key pair. This is the key pair the rescued funds will be sent to. 

He then generates a primary transaction to prove that he has a secret s. In fact that secret is his password. He does this by 
by pushing a request to the secure ether smart contract with:
```
hash(hash(PW) + salt + newpubkey) + hash(username)
```
The `hash(username)` is revealed to link this transaction to the data in the lost key's contract. This transaction needs to contain coins worth 10% of the recovering coin's worth. To discover the previous address we use the hash of the username, which is stored as a global field in the secure ether contract. The user leaves this 
transaction to mature for some time and then proceeds with the actual redeem transaction. In this he supplies what
has been hashed previously as the secret. Meaning he pushes on the stack:
```
hash(PW) + salt + newpubkey + hash(username)
```
This proves he is the owner of the correct password and is allowed to move the stuck coins back to a private key in his 
possession. If this transaction is successful the 10% of  your coins you needed to risk previously is also spent to his new address minus the used Gas. There is a one month timelock on this transaction however, for the following reason:

Should an adversary be able to find the inverse of the published hash (your password) and try to spend your coins, you 
have a one month time window to quickly come online and make a small proof, that you are still in possession of 
your private keys. If you manage to do this the 10% of your funds the attacker risked is directly spent to you. 
This makes it uneconomic  for the adversary to just try attacking random nodes in the network using the secure ether 
ERC 20. 

# Architecture Explained

The app uses the following architecture: The user interface is built on electron (located in folder of the same name - how surprising), the interface between ethereum and electron is written with the java script ethereum library. The core of
the code is a solidity contract (in SmartContracts) that powers the secure ether ERC20. The solidity contract is compiled and deployed using truffle and is run on a local geth client. The same geth client is also being used for the electron app to communicate with the electron app. Due to complications with versioning a web server is being used between electron and the javascript talking to geth. Hopefully this can be removed in the future. 



