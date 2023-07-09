// Web3 instance
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

// Async functions
async function connect() {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Connected: ", accounts[0]);
    document.getElementById("connectButton").innerHTML = accounts[0].substr(0, 2) + "..." + accounts[0].substr(-4);
    document.getElementById("connectButton").style.backgroundColor = '#1e2e9e';
}

async function createOracle() {
    const oracleName = document.getElementById('oracleNameInput').value;
    console.log("oracle name",oracleName)
    await oracleFactoryContract.methods.createOracle(oracleName).send({ from: accounts[0] });
    console.log("Oracle created");
}

async function fulfillRequest() {
    const oraclePrice = document.getElementById('oraclePriceInput').value;
    await oracleContract.methods.fulfillRequest(oraclePrice).send({ from: accounts[0] });
    console.log("Oracle request fulfilled");
}

const fetchOracleData = (pair) => {
    const apiUrl = 'https://openapi.bitrue.com/api/v1/ticker/price?symbol='+pair+'USDT';
    fetch(apiUrl, {})
        .then(response => response.json())
        .then(data => {
            console.log(data);
	    console.log(data.price);
	    document.getElementById(pair).innerHTML = data.price;	
	    return (data.price);
        })
        .catch(error => {
            console.log('Error fetching oracle data:', error);
        });
};

async function listOracles() {
    const oracleAddresses = await oracleFactoryContract.methods.getAllOracles().call();
    console.log('Oracle addresses: ', oracleAddresses);

   let oraclesContainer = document.getElementById("oraclesContainer");
    oraclesContainer.innerHTML = ''; // Clear the container

    for(let i = 0; i < oracleAddresses.length; i++) {
        let oracleContract = new web3.eth.Contract(oracleABI, oracleAddresses[i]);
        let oraclePrice = await oracleContract.methods.price().call();
        let oracleName = await oracleContract.methods.name().call();

        let newOracleRow = document.createElement('tr');

        let newOracleNameData = document.createElement('td');
        newOracleNameData.textContent = oracleName; // Replace this with your oracle name
        newOracleRow.appendChild(newOracleNameData);

        let newOracleAddressData = document.createElement('td');
        newOracleAddressData.textContent = oracleAddresses[i]; // Replace this with your oracle address
        newOracleRow.appendChild(newOracleAddressData);

        let newOraclePriceData = document.createElement('td');
        newOraclePriceData.textContent = oraclePrice; // Replace this with your oracle price
        newOracleRow.appendChild(newOraclePriceData);

	let newOracleLivePriceData = document.createElement('td');
	newOracleLivePriceData.setAttribute("id", oracleName);
        //newOracleLivePriceData.textContent = fetchOracleData(oracleName); // Replace this with your oracle live price
	fetchOracleData(oracleName);
	setInterval(() => { fetchOracleData(oracleName); }, 5000);
        newOracleRow.appendChild(newOracleLivePriceData);    
        document.getElementById('oraclesContainer').appendChild(newOracleRow);
    }
}

window.addEventListener('load', listOracles);

// Event listeners
document.getElementById('connectButton').addEventListener('click', connect);
document.getElementById('createOracleButton').addEventListener('click', createOracle);
