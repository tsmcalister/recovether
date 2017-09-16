const Web3 = require('web3');
const abi = require('human-standard-token-abi') // (erc20 abi) -> replace with securether abi
const net = require('net')


class EthWrapper {
    constructor(erc20contract){
        // initialise IpcProvider from local file
        this.web3 = new Web3(new Web3.providers.IpcProvider('/Users/timothy/Library/Ethereum/rinkeby/geth.ipc',net));
        // instantiate contract from abi and contract address 
        this.erc20 = new this.web3.eth.Contract(erc20contract.abi, erc20contract.address);
    }

    readKeyFile(password){
        // read encrypted key file
    }

    createKeyPair(salt){
        const account = this.web3.eth.accounts.create(salt);
        console.log('Created account:');
        console.log('Account: '+ account.address);
        console.log('Private Key: ' + account.privateKey);
        return({address: account.address,privateKey: account.privateKey});
    }

    addAccountToWallet(privateKey){
        this.web3.eth.accounts.wallet.add(myAccount.privateKey);
    }

    getRecovetherBalanceOf(address){
        this.erc20.methods.balanceOf('9f6294a019a2c5ee3e0ad46b7557ad4926cf8723').call().then((balance)=>{
            return(balance);
        });
    }

    // subscribe to contract event
    on(eventName,callback){
        // Perhaps intercept first?
        this.web3.eth.subscribe(eventName,{},(error,result)=> {
            console.log(result);
        });
    }
}

const erc20contract = {abi: abi, address: '9f6294a019a2c5ee3e0ad46b7557ad4926cf8723'};
const ethWrapper = new EthWrapper(erc20contract);

console.log(ethWrapper.createKeyPair('entropyyyyyyyyyyy'))





