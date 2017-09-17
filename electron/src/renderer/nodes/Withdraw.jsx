import React, { Component } from 'react'
import styled from 'styled-components'

import Button from 'material-ui/Button'
import Dialog from 'material-ui/Dialog'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import CloseIcon from 'material-ui-icons/Close'
import Slide from 'material-ui/transitions/Slide'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'

import { inject, observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

const Container = styled.div`
	max-width: 100%;
	padding-left: 30px;
	padding-right: 30px;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-items: center;
	justify-content: center;
`

const StyledButton = styled(Button)`margin-top: 10px;`

@inject('api', 'auth')
@observer
class Withdraw extends Component {
	@observable amount = 0

	@action setAmount = event => (this.amount = event.target.value)

	@computed
	get isValid() {
		return (
			this.amount >= 0 &&
			this.amount <= parseFloat(this.props.available, 10)
		)
	}

	handleWithdrawal = async () => {
		await this.props.api.withdrawFunds(this.amount)
		this.props.onClose()
	}

	render() {
		const { open, onClose } = this.props

		return (
			<Dialog
				fullScreen
				open={open}
				onRequestClose={this.onClose}
				transition={<Slide direction="up" />}
			>
				<AppBar>
					<Toolbar>
						<IconButton
							color="contrast"
							onClick={onClose}
							aria-label="Close"
						>
							<CloseIcon />
						</IconButton>
						<Typography type="title" color="inherit">
							Withdraw
						</Typography>
					</Toolbar>
				</AppBar>
				<Container>
					<Typography type="headline">{`${this.props
						.available} ETH available`}</Typography>

					<FormControl
						fullWidth
						margin="normal"
						error={!this.isValid}
					>
						<InputLabel htmlFor="amount">Amount:</InputLabel>
						<Input
							id="amount"
							fullWidth
							value={this.amount}
							onChange={this.setAmount}
							type="number"
						/>
						{!this.isValid && (
							<FormHelperText>
								An amount can not exceed your safe balance!
							</FormHelperText>
						)}
					</FormControl>
					<StyledButton
						color="primary"
						raised
						disabled={!this.isValid}
						onClick={this.handleWithdrawal}
					>
						transfer
					</StyledButton>
				</Container>
			</Dialog>
		)
	}
}

export default Withdraw
