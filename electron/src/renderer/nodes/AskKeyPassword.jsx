import React, { Component } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import { observable, action, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'

import { Redirect } from 'react-router-dom'

const { dialog } = remote

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

@inject('api', 'auth')
@observer
class AskKeyPassword extends Component {
	@observable pathname
	@observable password = ''
	@observable passwordInitial = true
	@observable redirect = false

	@computed
	get isPasswordOK() {
		if (this.passwordInitial) {
			return true
		} else {
			return this.password !== ''
		}
	}

	@computed
	get isButtonDisabled() {
		return this.password === ''
	}

	@action setPathname = pathname => (this.pathname = pathname)

	@action
	setPassword = event => {
		this.password = event.target.value
		if (this.passwordInitial) {
			this.passwordInitial = false
		}
	}

	@action goToAccount = () => (this.redirect = true)

	handleClick = () => {
		dialog.showOpenDialog({ properties: ['openFile'] }, paths =>
			this.setPathname(paths[0])
		)
	}

	handleSubmit = () => {
		try {
			const { api, auth } = this.props
			api.loadKey(this.pathname, this.password)
			auth.setPassword(this.password)
			this.goToAccount()
		} catch (err) {
			alert('Unable to decrypt the private key with the given password')
		}
	}

	render() {
		if (this.redirect) return <Redirect to="/account" />
		return (
			<Wrapper>
				<Button raised color="primary" onClick={this.handleClick}>
					Load key
				</Button>
				{this.pathname && <Typography>{this.pathname}</Typography>}
				<FormControl margin="normal" error={!this.isPasswordOK}>
					<InputLabel htmlFor="password">Password</InputLabel>
					<Input
						id="password"
						value={this.password}
						onChange={this.setPassword}
					/>
					{!this.isPasswordOK && (
						<FormHelperText>
							You need to provide password!
						</FormHelperText>
					)}
				</FormControl>
				<Button
					raised
					color="primary"
					disabled={this.isButtonDisabled}
					onClick={this.handleSubmit}
				>
					Decrypt
				</Button>
			</Wrapper>
		)
	}
}

export default AskKeyPassword
