const web3 = new Web3(window.ethereum);

// Contract ABI and address
const oracleFactoryABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "oracleAddress",
				"type": "address"
			}
		],
		"name": "OracleCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allOracles",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createOracle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "oracleAddress",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "data",
				"type": "int256"
			}
		],
		"name": "fulfillOracleRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllOracles",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "getOracle",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const oracleABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_price",
				"type": "int256"
			}
		],
		"name": "fulfillRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "price",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Replace with your contract addresses
const oracleFactoryAddress = "0xd6887f70d46a7253dAE1247C1eA38f0bD9DFEcda";

// Contract instances
const oracleFactoryContract = new web3.eth.Contract(oracleFactoryABI, oracleFactoryAddress);

// Accounts array
let accounts = [];


window.onload = function() {
  fetch('tokens.json')
    .then(response => response.json())
    .then(tokens => {
      const fromTokenDropdown = document.querySelector('#fromTokenDropdown .menu');
      const toTokenDropdown = document.querySelector('#toTokenDropdown .menu');

      tokens.forEach(token => {
        const optionA = document.createElement('div');
        optionA.className = 'item';
        optionA.dataset.value = token.tokenAddress;
        optionA.dataset.oracleAddress = token.oracleAddress;
        optionA.textContent = token.symbol;

        const optionB = optionA.cloneNode(true);

        fromTokenDropdown.appendChild(optionA);
        toTokenDropdown.appendChild(optionB);
      });

      // Initialize dropdowns with Semantic UI
      $('.ui.dropdown').dropdown();
    })
    .catch(error => console.error(error));

  document.getElementById("createPairButton").addEventListener("click", function() {
    const fromTokenAddress = $('#fromTokenDropdown').dropdown('get value');
    const toTokenAddress = $('#toTokenDropdown').dropdown('get value');

    const fromOracleAddress = $('#fromTokenDropdown').dropdown('get item').data('oracle-address');
    const toOracleAddress = $('#toTokenDropdown').dropdown('get item').data('oracle-address');

    // Now you have your selected token addresses and their corresponding oracle addresses
    // You can use these to interact with your smart contracts
    console.log(fromTokenAddress, toTokenAddress, fromOracleAddress, toOracleAddress);
  });
};

