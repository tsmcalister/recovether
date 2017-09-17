const Web3 = require('web3')
const abi = require('./recovether.abi.js') // (erc20 abi) -> replace with securether abi
const net = require('net')
const fs = require('fs')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'

class EthWrapper {
	constructor(erc20contract) {
		// initialise IpcProvider from local file
		this.web3 = new Web3(
			new Web3.providers.IpcProvider(
				'/Users/wasd171/Library/Ethereum/rinkeby/geth.ipc',
				net
			)
		)
		// this.web3 = new Web3(
		// 	new Web3.providers.WebsocketProvider('ws://localhost:8546')
		// )
		// instantiate contract from abi & contract address
		this.recovether = new this.web3.eth.Contract(
			erc20contract.abi,
			erc20contract.address
		)
		this.gasLimit = 4000000
		if (fs.existsSync('./keyfile.recovether'))
			this.privateKeyAvailable = true
	}

	readKeyFile(password) {
		fs.readFile('./keyfile.recovether', 'utf8', (err, contents) => {
			console.log(this.decrypt(contents, password))
		})
	}

	storeKeyFile(privateKey, password) {
		fs.writeFile(
			'./keyfile.recovether',
			this.encrypt(privateKey, password),
			function(err) {
				if (err) {
					return console.log(err)
				}

				console.log('The file was saved!')
			}
		)
	}

	encrypt(text, password) {
		var cipher = crypto.createCipher(algorithm, password)
		var crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex')
		return crypted
	}

	decrypt(text, password) {
		var decipher = crypto.createDecipher(algorithm, password)
		var dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8')
		return dec
	}

	createSalt() {
		return new Promise((resolve, reject) =>
			crypto.randomBytes(128, (err, buf) => {
				if (err) {
					reject(err)
				} else {
					resolve(buf)
				}
			})
		)
	}

	createKeyPair() {
		return this.createSalt().then(salt => {
			const account = this.web3.eth.accounts.create(salt)
			console.log('Created account:')
			console.log('Account: ' + account.address)
			console.log('Private Key: ' + account.privateKey)

			return {
				address: account.address,
				privateKey: account.privateKey
			}
		})
	}

	addAccountToWallet(privateKey) {
		this.web3.eth.accounts.wallet.add(privateKey)
		console.log(this.web3.eth.accounts.wallet[0].address)
	}

	// returns promise
	getRecovetherBalance() {
		return this.recovether.methods
			.balanceOf(this.web3.eth.accounts.wallet[0].address)
			.call()
	}

	getBalance() {
		return this.web3.eth.getBalance(
			this.web3.eth.accounts.wallet[0].address
		)
	}

	withdrawFunds(amount) {
		return this.recovether.methods
			.withdraw(Math.pow(10, 18) * amount)
			.send({
				to: this.recovether._address,
				from: this.web3.eth.accounts.wallet[0].address,
				gas: this.gasLimit
			})
		//this.web3.eth.sendTransaction({to: this.recovether._address,from: this.web3.eth.accounts.wallet[0].address, data: withdraw, gas: 40000});
	}

	secureFunds(amount) {
		// send x% of eth to contract address
		return this.web3.eth.sendTransaction({
			to: this.recovether._address,
			from: this.web3.eth.accounts.wallet[0].address,
			value: parseInt(amount * Math.pow(10, 18)),
			gas: this.gasLimit
		})
		// wait for n confirmations

		// call callback
	}

	recoverFunds(username, password, retrievalAddress, newPassword) {
		// publish knowledge of password
		// wait for n confirmations
		// publish password, retrieve funds and store new password
	}
	/*
    withdrawFunds(username, password,withdrawalAddress){
        // recover address from any key pair by 
    }

    withdrawFunds(withdrawalAddress){
        // call withdraw function 
    }
    */

	initializeAccount(username, password, amount) {
		//CREATE SALT HERE
		return this.createSalt().then(salt => {
			const usernameHash = this.web3.utils.soliditySha3(username)
			const passwordHash = this.web3.utils.soliditySha3(
				password + salt.toString()
			)
			console.log(usernameHash + '\n' + passwordHash)
			return this.recovether.methods
				.initializeAccount(usernameHash, passwordHash, salt.toString())
				.send({
					to: this.recovether._address,
					from: this.web3.eth.accounts.wallet[0].address,
					gas: this.gasLimit,
					value: amount * Math.pow(10, 18)
				})
		})
	}

	changePass(newPassword, salt) {
		//-salt
		const passwordHash = this.web3.utils.soliditySha3(
			newPassword + salt.toString()
		)
		return this.recovether.methods
			.changePass(passwordHash, salt.toString())
			.send({
				to: this.recovether._address,
				from: this.web3.eth.accounts.wallet[0].address,
				gas: this.gasLimit
			})
	}

	// subscribe to contract event (Tokentransfer / recovery attempt / withdraw attempt)
	on(eventName, callback) {
		// Perhaps intercept first?
		if (eventName == 'TokenCreation') {
			this.recovether.events.TokenCreation((error, result) => {
				if (!error)
					if (
						result.returnValues[0] ==
						this.web3.eth.accounts.wallet[0].address
					) {
						// check if event was caused by user
						callback(null, result.returnValues)
					} else
						callback('error subscribing to event: ' + error, null)
			})
		} else if (eventName == 'TokenDestruction') {
			this.recovether.events.TokenDestruction((error, result) => {
				if (!error)
					if (
						result.returnValues[0] ==
						this.web3.eth.accounts.wallet[0].address
					) {
						// check if event was caused by user
						callback(null, result.returnValues)
					} else
						callback('error subscribing to event: ' + error, null)
			})
		}
	}
}

const erc20contract = {
	abi: abi,
	address: '0xd41d1b985afC67f9A9aF61E893DaEe45A9C10Ff5'
}

module.exports = new EthWrapper(erc20contract)
// const ethWrapper = new EthWrapper(erc20contract)

// ethWrapper.addAccountToWallet(
// 	'0xab50026bab9a4a3a1c25b2e7ee896de7094d2b0a725773f62255912c1355ff2d'
// )

// ethWrapper.storeKeyFile('testtestestestestsetsetsetsetsetsetsetse', 'test')
// ethWrapper.readKeyFile('test')

/*
ethWrapper.getRecovetherBalance().then((balance) => {
    console.log(balance);
})
*/

//ethWrapper.initializeAccount('ronald','mcdonald',3141592654,0.1)

//ethWrapper.changePass('trololololol',19283749)

//// TROLOLOL infinite loop
/*
ethWrapper.on('TokenCreation',(error,result) => {
    if(!error)
    ethWrapper.getRecovetherBalance().then((balance) => {
        console.log(balance);
    })
})

ethWrapper.on('TokenDestruction',(error,result) => {
    if(!error)
        ethWrapper.secureFunds(0.01);
})
*/
