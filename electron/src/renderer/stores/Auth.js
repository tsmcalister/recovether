import { observable, action } from 'mobx'

export class Auth {
	@observable password = null
	@observable newPassword = null

	@action setPassword = password => (this.password = password)
	@action setNewPassword = newPassword => (this.newPassword = newPassword)
}
