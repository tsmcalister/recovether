import { observable, action } from 'mobx'

export class Auth {
	@observable login = null
	@observable password = null
	@observable newPassword = null
	@observable address = null

	@action setLogin = login => (this.login = login)
	@action setPassword = password => (this.password = password)
	@action setNewPassword = newPassword => (this.newPassword = newPassword)
	@action setAddress = address => (this.address = address)
}
