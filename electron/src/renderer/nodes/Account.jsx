import React, { Component } from 'react'
import styled from 'styled-components'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import Withdraw from './Withdraw'

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const StyledButton = styled(Button)`margin-top: 50px;`

@observer
class Account extends Component {
	@observable open = false

	@action
	handleClick = () => {
		this.open = true
	}

	@action
	handleClose = () => {
		this.open = false
	}

	render() {
		return (
			<Container>
				<Typography type="display2">15.4 ETH</Typography>
				<StyledButton color="primary" raised onClick={this.handleClick}>
					Withdraw
				</StyledButton>
				<Withdraw open={this.open} onClose={this.handleClose} />
			</Container>
		)
	}
}

export default Account
