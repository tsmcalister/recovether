import React, { Component } from 'react'
import styled from 'styled-components'
import Button from 'material-ui/Button'
import { observable, action, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import Withdraw from './Withdraw'
import { CardHeader, CardActions } from 'material-ui/Card'
import Divider from 'material-ui/Divider'
import Table, {
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'

const Container = styled.div`
	width: 100%;
	height: 100%;
`

const StyledButton = styled(Button)`margin-top: 50px;`

@inject('api', 'auth')
@observer
class Account extends Component {
	componentDidMount() {
		this.intervalSafeBalance = setInterval(async () => {
			const balance = await this.props.api.getSafeBalance()
			this.setSafe(balance)
		}, 100)

		this.intervalBalance = setInterval(async () => {
			const balance = await this.props.api.getBalance()
			this.setBalance(balance)
		}, 100)
	}

	componentWillUnmount() {
		clearInterval(this.intervalSafeBalance)
		clearInterval(this.intervalBalance)
	}

	intervalSafeBalance
	intervalBalance
	@observable safeValue = null
	@observable balance = null
	@observable open = false
	@observable forceLoader = false

	@computed
	get isWithdrawDisabled() {
		return parseFloat(this.safeValue, 10) === 0
	}

	@computed
	get isRetrieveDisabled() {
		return parseFloat(this.balance, 10) === 0
	}

	@action
	setSafe = value => {
		this.safeValue = value
	}

	@action setBalance = balance => (this.balance = balance)

	@action
	handleClick = () => {
		this.open = true
	}

	@action
	handleClose = () => {
		this.open = false
	}

	@action setForceLoader = force => (this.forceLoader = force)

	handleRetrieve = async () => {
		const { api, auth } = this.props
		this.setForceLoader(true)
		await api.createClaimFundsRequest({
			username: auth.login,
			password: auth.password,
			newPassword: auth.newPassword
		})
		this.setForceLoader(false)
	}

	formatTXID(txid) {
		return `${txid.substring(0, 16)}...`
	}

	render() {
		let safeTitle
		if (this.forceLoader) {
			safeTitle = <CircularProgress />
		} else {
			safeTitle =
				this.safeValue === null ? '...' : `${this.safeValue} secure ETH`
		}

		return (
			<Container>
				<CardHeader
					title="Address"
					subheader={this.props.auth.address}
				/>
				{/* <CardActions>
					<Button color="primary" raised>
						Buy external ETH
					</Button>
				</CardActions> */}
				{/* <div>
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
				</div> */}

				<Divider />
				<CardHeader subheader="Safe vault" title={safeTitle} />

				<CardActions>
					<StyledButton
						color="primary"
						raised
						onClick={this.handleClick}
						disabled={this.isWithdrawDisabled}
					>
						Withdraw
					</StyledButton>
				</CardActions>
				<Divider />
				<CardHeader
					subheader="Regular vault"
					title={`${this.balance === null
						? '...'
						: this.balance} ETH`}
				/>

				<CardActions>
					<Button
						color="primary"
						raised
						disabled={this.isRetrieveDisabled}
						onClick={this.handleRetrieve}
					>
						Retrieve safe funds
					</Button>
				</CardActions>
				<Withdraw
					open={this.open}
					onClose={this.handleClose}
					available={this.safeValue}
				/>
			</Container>
		)
	}
}

export default Account
