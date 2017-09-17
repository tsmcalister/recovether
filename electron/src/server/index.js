const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
const eth = require('./eth/eth')

function respond(ws, message, value) {
	ws.send(JSON.stringify({ id: message.id, value }))
}

wss.on('connection', ws => {
	ws.on('message', async string => {
		const message = JSON.parse(string)
		let res
		switch (message.type) {
			case 'createKeyPair':
				res = await eth.createKeyPair()
				eth.addAccountToWallet(res.privateKey)
				break
			case 'getRecovetherBalance':
				res = await eth.getRecovetherBalance()
				break
			case 'getBalance':
				res = await eth.getBalance()
				break
			case 'withdrawFunds':
				res = await eth.withdrawFunds(message.value)
				break
			case 'createClaimFundsRequest':
				const { username, password, newPassword } = message.value
				res = await eth.createClaimFundsRequest(
					username,
					password,
					newPassword
				)
				break
			case 'initializeAccount':
				res = await eth.initializeAccount(
					message.value.username,
					message.value.password,
					message.value.amount
				)
				break
		}
		respond(ws, message, res)
	})
})
