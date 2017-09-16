import React, { Component } from 'react'
import styled from 'styled-components'

import ApplicationBar from './nodes/ApplicationBar'
import ApplicationContainer from './nodes/ApplicationContainer'

import Login from './nodes/Login'
import Account from './nodes/Account'

import { Route, Switch, Redirect } from 'react-router-dom'

const Container = styled.div`
	height: 100vh;
	width: 100vw;
`

class App extends Component {
	render() {
		return (
			<Switch>
				<Route
					exact
					path="/"
					render={() => {
						return <Redirect to="/login" />
					}}
				/>
				<Route
					path="*"
					render={() => (
						<Container>
							<ApplicationBar />
							<ApplicationContainer>
								<Route path="/login" component={Login} />
								<Route path="/account" component={Account} />
							</ApplicationContainer>
						</Container>
					)}
				/>
			</Switch>
		)
	}
}

export default App
