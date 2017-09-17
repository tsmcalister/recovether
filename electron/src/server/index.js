const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
const eth = require('./eth/eth')

wss.on('connection', ws => {
	ws.on('message', async string => {
		const message = JSON.parse(string)
		switch (message.type) {
			case 'createKeyPair':
				const res = await eth.createKeyPair()
				ws.send(JSON.stringify({ id: message.id, value: res }))
				break
		}
	})
})
