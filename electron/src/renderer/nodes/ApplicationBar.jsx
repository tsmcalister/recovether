import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import { Route } from 'react-router-dom'

function Title({ title }) {
	return (
		<Typography type="title" color="inherit">
			{title}
		</Typography>
	)
}

class ApplicationBar extends Component {
	render() {
		return (
			<AppBar>
				<Toolbar>
					<Route
						path="/login"
						render={() => <Title title="Login" />}
					/>
					<Route
						path="/account"
						render={() => <Title title="Account" />}
					/>
				</Toolbar>
			</AppBar>
		)
	}
}

export default ApplicationBar
