var Web3 = require('./node_modules/Web3');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  //web3 = new Web3(new Web3.providers.HttpProvider("http://172.30.0.48:8545"));
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var maxlevels = 10;

var getValue = function(n){
    if (n > maxlevels)
        return;
    web3.eth.getStorageAt('a72b95cbe173840cb933b5225523c3b1b6d0f68e', n,(error,result) => {
        if(!error)
        {
            console.log(result)
            getValue(n+1);
        }
    else
        console.error(error);
    })
}

getValue(0);

