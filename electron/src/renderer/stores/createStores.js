import { API } from './API'
import { Auth } from './Auth'

export function createStores() {
	const api = new API()
	const auth = new Auth()

	return { api, auth }
}
