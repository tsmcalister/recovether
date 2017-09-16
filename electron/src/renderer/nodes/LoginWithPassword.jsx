import React, { Component } from 'react'
import InputForm from './InputForm'
import styled from 'styled-components'

import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import { Redirect } from 'react-router-dom'

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const StyledWrapper = styled(Wrapper)`
	justify-content: center;
	height: 100%;
`

@inject('api', 'auth')
@observer
class LoginWithPassword extends Component {
	@observable isOpen = false
	@observable redirect = false

	@action
	setOpen = open => {
		this.isOpen = open
	}

	@action
	goToAccount = () => {
		this.redirect = true
	}

	handleRequestClose = () => {
		this.setOpen(false)
	}

	handleSubmit = (login, password, newPassword) => {
		try {
			const { api, auth } = this.props
			api.logIn(login, password)
			auth.setPassword(password)
			auth.setNewPassword(newPassword)
			this.goToAccount()
		} catch (err) {
			this.setOpen(true)
			setTimeout(() => this.setOpen(false), 5000)
		}
	}

	render() {
		if (this.redirect) return <Redirect to="/account" />
		return (
			<StyledWrapper>
				<Wrapper>
					<InputForm onSubmit={this.handleSubmit} needNew />
				</Wrapper>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center'
					}}
					open={this.isOpen}
					autoHideDuration={5000}
					onRequestClose={this.handleRequestClose}
					SnackbarContentProps={{
						'aria-describedby': 'message-id'
					}}
					message={<span id="message-id">Wrong credentials!</span>}
					action={
						<IconButton
							key="close"
							aria-label="Close"
							color="inherit"
							onClick={this.handleRequestClose}
						>
							<CloseIcon />
						</IconButton>
					}
				/>
			</StyledWrapper>
		)
	}
}

export default LoginWithPassword
