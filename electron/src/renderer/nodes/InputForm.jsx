import React, { Component } from 'react'
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Button from 'material-ui/Button'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 80%;
`

const StyledButton = styled(Button)`margin-top: 15px;`

@observer
class InputForm extends Component {
	@observable login = ''
	@observable password = ''
	@observable newPassword = ''
	@observable
	initial = {
		login: true,
		password: true,
		newPassword: true
	}

	@computed
	get isLoginOK() {
		if (this.initial.login) {
			return true
		} else {
			return this.login !== ''
		}
	}

	@computed
	get isPasswordOK() {
		if (this.initial.password) {
			return true
		} else {
			return this.password !== ''
		}
	}

	@computed
	get isNewPasswordOK() {
		if (this.initial.newPassword) {
			return true
		} else {
			return this.newPassword !== '' && this.newPassword !== this.password
		}
	}

	@computed
	get isButtonDisabled() {
		const { login, password, newPassword } = this.initial
		if (login || password || newPassword) {
			return true
		} else {
			return !(
				this.isLoginOK &&
				this.isPasswordOK &&
				this.isNewPasswordOK
			)
		}
	}

	@action
	setLogin = event => {
		const login = event.target.value

		this.login = login
		if (this.initial.login) {
			this.initial.login = false
		}
	}

	@action
	setPassword = event => {
		const password = event.target.value

		this.password = password
		if (this.initial.password) {
			this.initial.password = false
		}
	}

	@action
	setNewPassword = event => {
		const password = event.target.value

		this.newPassword = password
		if (this.initial.newPassword) {
			this.initial.newPassword = false
		}
	}

	handleSubmit = () => {
		this.props.onSubmit(this.login, this.password, this.newPassword)
	}

	render() {
		const { needNew } = this.props
		return (
			<Wrapper>
				<FormControl margin="normal" error={!this.isLoginOK}>
					<InputLabel htmlFor="login">Login</InputLabel>
					<Input
						id="login"
						value={this.login}
						onChange={this.setLogin}
					/>
					{!this.isLoginOK && (
						<FormHelperText>
							You need to provide login!
						</FormHelperText>
					)}
				</FormControl>
				<FormControl margin="normal" error={!this.isPasswordOK}>
					<InputLabel htmlFor="password">
						{needNew ? 'Old password' : 'Password'}
					</InputLabel>
					<Input
						id="password"
						type="password"
						value={this.password}
						onChange={this.setPassword}
					/>
					{!this.isPasswordOK && (
						<FormHelperText>
							You need to provide password!
						</FormHelperText>
					)}
				</FormControl>
				{needNew && (
					<FormControl margin="normal" error={!this.isNewPasswordOK}>
						<InputLabel htmlFor="new-password">
							New password
						</InputLabel>
						<Input
							id="new-password"
							type="password"
							value={this.newPassword}
							onChange={this.setNewPassword}
						/>
						{!this.isNewPasswordOK && (
							<FormHelperText>
								New password can't be empty or equal to an old
								password!
							</FormHelperText>
						)}
					</FormControl>
				)}
				<StyledButton
					raised
					color="primary"
					onClick={this.handleSubmit}
					disabled={this.isButtonDisabled}
				>
					Next
				</StyledButton>
			</Wrapper>
		)
	}
}

export default InputForm
