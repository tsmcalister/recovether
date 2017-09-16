import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'material-ui/Button'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import Withdraw from './Withdraw'
import { CardHeader, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import Table, {
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from 'material-ui/Table'

const Container = styled.div`
	width: 100%;
	height: 100%;
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

	formatTXID(txid) {
		return `${txid.substring(0, 16)}...`
	}

	render() {
		return (
			<Container>
				<CardHeader
					title="Public key hash"
					subheader="0xea674fdde714fd979de3edf0f56aa9716b898ec8"
				/>

				{/* <Button color="primary" raised onClick={this.handleClick}>
						Buy external ETH
					</Button> */}
				<div>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell compact>txid</TableCell>
								<TableCell compact>Amount</TableCell>
								<TableCell compact>Confirmations</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell compact>
									{this.formatTXID(
										'0x2eb4e4e102602418819106d74e53fc7825e4e8a061ca0497ac448e93c733fbe7'
									)}
								</TableCell>
								<TableCell compact>5.0</TableCell>
								<TableCell compact>1</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>

				<Divider />
				<CardHeader subheader="Safe vault" title="0 ETH" />

				<CardActions>
					<StyledButton
						color="primary"
						raised
						onClick={this.handleClick}
					>
						Withdraw
					</StyledButton>
				</CardActions>
				<Divider />
				<CardHeader subheader="Regular vault" title="15.8 ETH" />

				<CardActions>
					<Button color="primary" raised onClick={this.handleClick}>
						Retrieve safe funds
					</Button>
				</CardActions>
				<Withdraw open={this.open} onClose={this.handleClose} />
			</Container>
		)
	}
}

export default Account
