const ws = new WebSocket('ws://localhost:8080')
let i = 0

export class API {
	map = new Map()

	constructor() {
		ws.onmessage = async event => {
			const message = JSON.parse(event.data)

			const handler = this.map.get(message.id)
			handler(message.value)
			this.map.delete(message.id)
		}
	}

	send(type, value) {
		i++
		ws.send(
			JSON.stringify({
				type,
				id: i,
				value
			})
		)
		return new Promise(resolve => this.map.set(i, resolve))
	}

	createKeyPair() {
		return this.send('createKeyPair')
	}

	getSafeBalance() {
		return this.send('getRecovetherBalance')
	}

	getBalance() {
		return this.send('getBalance')
	}

	withdrawFunds(amount) {
		return this.send('withdrawFunds', amount)
	}

	createClaimFundsRequest({ username, password, newPassword }) {
		return this.send('createClaimFundsRequest', {
			username,
			password,
			newPassword
		})
	}

	async initializeAccount({ username, password, amount }) {
		const res = await this.send('initializeAccount', {
			username,
			password,
			amount
		})
		console.log(res)
		return res
	}

	logIn(login, password) {
		// throw new Error('Unable to log in')
	}
}
