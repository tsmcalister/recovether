const rewireMobX = require('react-app-rewire-mobx')

module.exports = function override(config, env) {
	const rewired = rewireMobX(config)
	rewired.target = 'electron-renderer'

	return rewired
}
