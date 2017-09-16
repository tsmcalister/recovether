const Web3 = require('web3');
const abi = require('./recovether.abi.js') // (erc20 abi) -> replace with securether abi
const net = require('net')


class EthWrapper {
    constructor(erc20contract){
        // initialise IpcProvider from local file
        this.web3 = new Web3(new Web3.providers.IpcProvider('/Users/timothy/Library/Ethereum/rinkeby/geth.ipc',net));
        // instantiate contract from abi & contract address 
        this.recovether = new this.web3.eth.Contract(erc20contract.abi, erc20contract.address);
    }

    readKeyFile(password){
        // read encrypted key file
    }

    storeKeyFile(password,privateKey){
        // encrypt and save key file
    }

    createKeyPair(salt){
        const account = this.web3.eth.accounts.create(salt);
        console.log('Created account:');
        console.log('Account: '+ account.address);
        console.log('Private Key: ' + account.privateKey);
        return({address: account.address,privateKey: account.privateKey});
    }

    addAccountToWallet(privateKey){
        this.web3.eth.accounts.wallet.add(privateKey);
        console.log(this.web3.eth.accounts.wallet[0].address)
    }

    // returns promise
    getRecovetherBalance(){
        return this.recovether.methods.balanceOf(this.web3.eth.accounts.wallet[0].address).call();
    }

    secureFunds(username, password){
        // send x% of eth to contract address
        
        // wait for n confirmations

        // call callback
    }

    recoverFunds(username, password, retrievalAddress, newPassword){
        // publish knowledge of password

        // wait for n confirmations

        // publish password, retrieve funds and store new password
    }

    withdrawFunds(username, password,withdrawalAddress){
        // recover address from any key pair by 
    }

    withdrawFunds(withdrawalAddress){
        // call withdraw function 
    }

    // subscribe to contract event (Tokentransfer / recovery attempt / withdraw attempt)
    on(eventName,callback){
        // Perhaps intercept first?
        this.web3.eth.subscribe(eventName,{},(error,result)=> {
            if(!error)
                callback(null,result)
            else
                callback('error subscribing to event: ' + error,null);
        });
    }
}

const erc20contract = {abi: abi, address: '86dFA989D821E9C1f610091E77BDdBB58B02e808'};
const ethWrapper = new EthWrapper(erc20contract);

ethWrapper.addAccountToWallet("0xab50026bab9a4a3a1c25b2e7ee896de7094d2b0a725773f62255912c1355ff2d")

ethWrapper.getRecovetherBalance().then((balance)=>{
    console.log(balance*Math.pow(10,-18))
})





