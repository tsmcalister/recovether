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
import { FormControl } from 'material-ui/Form'

import { inject, observer } from 'mobx-react'

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
	render() {
		const { open, onClose } = this.props

		return (
			<Dialog
				fullScreen
				open={open}
				onRequestClose={this.handleRequestClose}
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
					<FormControl fullWidth margin="normal">
						<InputLabel htmlFor="destination">
							Transfer to:
						</InputLabel>
						<Input id="destination" fullWidth />
					</FormControl>
					<FormControl fullWidth margin="normal">
						<InputLabel htmlFor="amount">Amount:</InputLabel>
						<Input id="amount" fullWidth />
					</FormControl>
					<StyledButton color="primary" raised>
						transfer
					</StyledButton>
				</Container>
			</Dialog>
		)
	}
}

export default Withdraw
