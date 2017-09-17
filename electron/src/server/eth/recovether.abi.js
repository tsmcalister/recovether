module.exports = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [
			{
				name: '',
				type: 'string'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_spender',
				type: 'address'
			},
			{
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'approve',
		outputs: [
			{
				name: 'success',
				type: 'bool'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				name: '',
				type: 'uint256'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address'
			},
			{
				name: '_to',
				type: 'address'
			},
			{
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'transferFrom',
		outputs: [
			{
				name: 'success',
				type: 'bool'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'withdraw',
		outputs: [],
		payable: false,
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				name: '',
				type: 'uint8'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_hashedUsername',
				type: 'bytes32'
			},
			{
				name: '_singleHashedPw',
				type: 'bytes32'
			},
			{
				name: 'newPwHash',
				type: 'bytes32'
			},
			{
				name: 'newSalt',
				type: 'bytes32'
			}
		],
		name: 'confirmFundsRequest',
		outputs: [],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_hashedPass',
				type: 'bytes32'
			},
			{
				name: 'salt',
				type: 'bytes32'
			}
		],
		name: 'changePass',
		outputs: [],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_hashedUsername',
				type: 'bytes32'
			}
		],
		name: 'claimFunds',
		outputs: [],
		payable: false,
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address'
			}
		],
		name: 'balanceOf',
		outputs: [
			{
				name: 'balance',
				type: 'uint256'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_hashedUsername',
				type: 'bytes32'
			},
			{
				name: '_requestHash',
				type: 'bytes32'
			}
		],
		name: 'createClaimFundsRequest',
		outputs: [],
		payable: true,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_hashedUsername',
				type: 'bytes32'
			},
			{
				name: '_singleHashedPw',
				type: 'bytes32'
			},
			{
				name: 'pubKey',
				type: 'address'
			}
		],
		name: 'calculateRequestHash',
		outputs: [
			{
				name: 'requestHash',
				type: 'bytes32'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				name: '',
				type: 'string'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_to',
				type: 'address'
			},
			{
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'transfer',
		outputs: [
			{
				name: 'success',
				type: 'bool'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [],
		name: 'getTotalSupply',
		outputs: [
			{
				name: 'balance',
				type: 'uint256'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_singleHashedPw',
				type: 'bytes32'
			},
			{
				name: 'salt',
				type: 'bytes32'
			}
		],
		name: 'hashPassword',
		outputs: [
			{
				name: 'hash',
				type: 'bytes32'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address'
			},
			{
				name: '_spender',
				type: 'address'
			}
		],
		name: 'allowance',
		outputs: [
			{
				name: 'remaining',
				type: 'uint256'
			}
		],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_attacker',
				type: 'address'
			}
		],
		name: 'interruptClaiming',
		outputs: [],
		payable: false,
		type: 'function'
	},
	{
		constant: false,
		inputs: [
			{
				name: '_hashedUsername',
				type: 'bytes32'
			},
			{
				name: '_doubleHashedPass',
				type: 'bytes32'
			},
			{
				name: 'salt',
				type: 'bytes32'
			}
		],
		name: 'initializeAccount',
		outputs: [],
		payable: true,
		type: 'function'
	},
	{
		inputs: [],
		payable: false,
		type: 'constructor'
	},
	{
		payable: true,
		type: 'fallback'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				name: '_targetAccount',
				type: 'address'
			},
			{
				indexed: false,
				name: '_issuer',
				type: 'address'
			}
		],
		name: 'CFRequestInitialization',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_account',
				type: 'address'
			}
		],
		name: 'AccountInitialization',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				name: '_target',
				type: 'address'
			},
			{
				indexed: false,
				name: '_issuer',
				type: 'address'
			}
		],
		name: 'ClaimingPeriodStart',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				name: '_victim',
				type: 'address'
			},
			{
				indexed: false,
				name: '_attacker',
				type: 'address'
			}
		],
		name: 'ClaimingInterruption',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				name: '_from',
				type: 'address'
			},
			{
				indexed: false,
				name: '_to',
				type: 'address'
			},
			{
				indexed: false,
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'FundTransfer',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_from',
				type: 'address'
			},
			{
				indexed: false,
				name: '_value',
				type: 'uint256'
			}
		],
		name: 'TokenCreation',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_to',
				type: 'address'
			},
			{
				indexed: false,
				name: '_value',
				type: 'uint256'
			}
		],
		name: 'TokenDestruction',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_from',
				type: 'address'
			},
			{
				indexed: true,
				name: '_to',
				type: 'address'
			},
			{
				indexed: false,
				name: '_value',
				type: 'uint256'
			}
		],
		name: 'Transfer',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_owner',
				type: 'address'
			},
			{
				indexed: true,
				name: '_spender',
				type: 'address'
			},
			{
				indexed: false,
				name: '_value',
				type: 'uint256'
			}
		],
		name: 'Approval',
		type: 'event'
	}
]
