import React, { Component } from 'react'
import styled from 'styled-components'

import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import { Route, Switch, Link } from 'react-router-dom'

import LoginWithPassword from './LoginWithPassword'

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const TitleWrapper = styled.div`margin-top: 30px;`

const TopButton = styled(Button)`margin-top: 50px;`
const StyledButton = styled(Button)`margin-top: 20px;`
const UnstyledLink = styled(Link)`text-decoration: none;`
const Image = styled.img`
	width: 30%;
	margin-top: 20px;
`

class Login extends Component {
	render() {
		return (
			<Switch>
				<Route
					exact
					path="/login"
					render={() => (
						<Wrapper>
							<TitleWrapper>
								<Typography type="display2">
									Recovether
								</Typography>
							</TitleWrapper>
							<Image src="/logo.png" />
							<UnstyledLink to="/login/private-password">
								<TopButton raised color="accent">
									I have a private key
								</TopButton>
							</UnstyledLink>
							<UnstyledLink to="/login/password">
								<StyledButton raised color="primary">
									I only have a password
								</StyledButton>
							</UnstyledLink>
							<UnstyledLink to="/login/register">
								<StyledButton raised>
									Create your safe wallet
								</StyledButton>
							</UnstyledLink>
						</Wrapper>
					)}
				/>
				<Route path="/login/password" component={LoginWithPassword} />
			</Switch>
		)
	}
}

export default Login
