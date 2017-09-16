import React, { Component } from 'react'
import styled from 'styled-components'
import InputForm from './InputForm'

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

class CreateKey extends Component {
	handleSubmit = (login, pass) => {}

	render() {
		return (
			<Wrapper>
				<InputForm onSubmit={this.handleSubmit} />
			</Wrapper>
		)
	}
}

export default CreateKey
