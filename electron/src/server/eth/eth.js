const Web3 = require('web3')
const abi = require('./recovether.abi.js') // (erc20 abi) -> replace with securether abi
const net = require('net')
const fs = require('fs')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const BigNumber = require('bignumber.js')

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
					resolve(buf.toString('hex'))
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

	async initializeAccount(username, password, amount) {
		//CREATE SALT HERE
		const salt = await this.createSalt()

		// const usernameHash = this.web3.utils.soliditySha3(username)
		// const passwordHash = this.web3.utils.soliditySha3(
		// 	password + salt.toString()
		// )

		const usernameHash = this.web3.utils.sha3(username)
		const passwordHash = await this.recovether.methods
			.hashPassword(this.web3.utils.sha3(password), salt)
			.call()

		console.log(usernameHash + '\n' + passwordHash)
		console.log(parseInt(amount * Math.pow(10, 18), 10))
		const num = parseInt(amount * Math.pow(10, 18), 10)
		const bignum = new BigNumber(num.toString())
		console.log(bignum)

		try {
			return this.recovether.methods
				.initializeAccount(usernameHash, passwordHash, salt.toString())
				.send({
					to: this.recovether._address,
					from: this.web3.eth.accounts.wallet[0].address,
					gas: this.gasLimit,
					value: bignum
				})
		} catch (err) {
			console.log(err)
		}
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

	///////

	async createClaimFundsRequest(username, password, newPassword) {
		const hashedUsername = this.web3.utils.sha3(username)
		const hashedPassword = this.web3.utils.sha3(password)
		const publicKey = this.web3.eth.accounts.wallet[0].address
		const salt = this.getRandomSalt()
		const newSalt = this.getRandomSalt()
		const newPasswordHash = this.web3.utils.sha3(newPassword)
		const hash = await this.recovether.methods
			.calculateRequestHash(hashedUsername, hashedPassword, publicKey)
			.call()
		const funds = await this.getRecovetherBalance()
		await this.recovether.methods
			.createClaimFundsRequest(hashedUsername, hash)
			.send({
				to: this.recovether._address,
				from: this.web3.eth.accounts.wallet[0].address,
				gas: this.gasLimit,
				value: parseInt(funds * 0.1)
			})
		await this.on('ClaimingPeriodStart')
		await this.waitForNBlocks(10)
		await this.recovether.methods
			.confirmFundsRequest(
				hashedUsername,
				hashedPassword,
				newPasswordHash,
				newSalt
			)
			.send({
				to: this.recovether._address,
				from: this.web3.eth.accounts.wallet[0].address,
				gas: this.gasLimit
			})
		await Promise.delay(1000 * 60)
		this.recovether.methods.claimFunds(hashedUsername).send({
			to: this.recovether._address,
			from: this.web3.eth.accounts.wallet[0].address,
			gas: this.gasLimit
		})
	}

	async waitForNBlocks(n) {
		return new Promise((resolve, reject) => {
			let i = 0
			const result = this.web3.eth.subscribe('newBlockHeaders', _ => {
				if (++i >= n) {
					resolve()
				}
				console.log(i + '......')
			})
		})
	}

	interruptClaiming(attackerPublicKey) {
		return this.recovether.methods
			.interruptClaiming(attackerPublicKey)
			.send({
				to: this.recovether._address,
				from: this.web3.eth.accounts.wallet[0].address,
				gas: this.gasLimit
			})
	}

	addHelpfulFriendsPrivateKey() {
		this.web3.eth.accounts.wallet.add(
			'0xab50026bab9a4a3a1c25b2e7ee896de7094d2b0a725773f62255912c1355ff2d'
		)
	}

	// here for you, when you need him, up to 7.4 ethereum. don't be greedy though
	requestHelpFromFriend(amount) {
		return this.web3.eth.sendTransaction({
			to: this.web3.eth.accounts.wallet[0].address,
			from: this.web3.eth.accounts.wallet[1].address,
			gas: this.gasLimit,
			value: amount * Math.pow(10, 18)
		})
	}
}

const erc20contract = {
	abi: abi,
	address: '0xF07a9048F57d4903A3d75Ed618527f87A0833529'
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
