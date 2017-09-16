import styled from 'styled-components'

const appBarHeight = '56px'

const ApplicationContainer = styled.div`
	height: calc(100vh - ${appBarHeight});
	padding-top: ${appBarHeight};
	width: 100vw;
`

export default ApplicationContainer
