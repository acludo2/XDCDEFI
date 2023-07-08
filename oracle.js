// Web3 instance
const web3 = new Web3(window.ethereum);

// Contract ABI and address
const oracleFactoryABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "allOracles",
        "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "createOracle",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const oracleABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "price",
        "outputs": [
            {
                "name": "",
                "type": "int256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_price",
                "type": "int"
            }
        ],
        "name": "fulfillRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Replace with your contract addresses
const oracleFactoryAddress = "0xYourOracleFactoryContractAddress";
const oracleAddress = "0xYourOracleContractAddress";

// Contract instances
const oracleFactoryContract = new web3.eth.Contract(oracleFactoryABI, oracleFactoryAddress);
const oracleContract = new web3.eth.Contract(oracleABI, oracleAddress);

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
    await oracleFactoryContract.methods.createOracle(oracleName).send({ from: accounts[0] });
    console.log("Oracle created");
}

async function fulfillRequest() {
    const oraclePrice = document.getElementById('oraclePriceInput').value;
    await oracleContract.methods.fulfillRequest(oraclePrice).send({ from: accounts[0] });
    console.log("Oracle request fulfilled");
}

// Event listeners
document.getElementById('connectButton').addEventListener('click', connect);
document.getElementById('createOracleButton').addEventListener('click', createOracle);
document.getElementById('fulfillRequestButton').addEventListener('click', fulfillRequest);
