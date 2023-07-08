    const selectedAddress = localStorage.getItem('selectedAddress');
        if (selectedAddress) {
         console.log("Localstorage: " + selectedAddress);
          window.ethereum.enable();
          window.web3.eth.defaultAccount = selectedAddress;
            accounts[0] = selectedAddress;
            showConnect()

        }

let countdown = 5; // Set the initial countdown value (in seconds)
const updateCountdown = () => {
    countdown--;
    if (countdown === 0) {
        countdown = 5; // Reset the countdown
        fetchCryptoData(); // Fetch new data
    }
    document.getElementById('countdown').innerText = "Refresh in " + countdown.toString() + " seconds";
};

const fetchCryptoData = () => {
    const apiUrl = 'https://bitrue.armsves.workers.dev';
    fetch(apiUrl, {})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("price-ticker").innerHTML = "Current Price: " + data.price + " USDT/XDC";
        })
        .catch(error => {
            console.log('Error fetching crypto data:', error);
        });
};
setInterval(updateCountdown, 1000);
fetchCryptoData();

const web3 = new Web3(window.ethereum);
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "CollateralWithdrawn",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "createLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "depositor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "depositCollateral",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "LoanCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "LoanRepaid",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "repayLoan",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawCollateral",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "collateral",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
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
        "name": "loans",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "collateral",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LTV_RATIO",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalPool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]; // Add contract ABI here
const contractAddress = "0x85DB6F29409dA1d2e29f3390C6f7AED95d796E6D"; // Add contract address here
const contract = new web3.eth.Contract(contractABI, contractAddress);
let accounts = [];

async function showConnect() {
    console.log("Connected: ", accounts[0]);
    //let balance = await web3.eth.getBalance(accounts[0]).then(console.log);
    web3.eth.getChainId().then(console.log);
    document.getElementById("connectButton").innerHTML = accounts[0].substr(0, 2) + "..." + accounts[0].substr(-4);
    document.getElementById("connectButton").style.backgroundColor = '#1e2e9e';
    balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether');
    //document.getElementById("depositMaxButton").innerHTML = "Deposit Max XDC (max is:" + balance;
    document.getElementById("balance").innerHTML = "Balance: " + parseFloat(balance).toFixed(4) + " XDC";
    console.log("Balance is: ", balance);
    window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log("Account changed: ", accounts[0]);
    });
}
async function connect() {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //window.ethereum.on('accountsChanged', function (accounts) {
          localStorage.setItem('selectedAddress', accounts[0]);
          window.web3.eth.defaultAccount = accounts[0];
     //   });
    showConnect()
}
async function deposit() {
    await contract.methods.deposit().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
    console.log("Deposit successful");
}

async function depositCollateral() {
    await contract.methods.depositCollateral().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
    console.log("Collateral deposit successful");
}

async function createLoan() {
    const loanAmount = document.getElementById('loanAmountInput').value;
    await contract.methods.createLoan(web3.utils.toWei(loanAmount, 'ether')).send({ from: accounts[0] });
    console.log("Loan created");
}


async function repayLoan() {
    const { isActive, amount } = await contract.methods.getLoanDetails(accounts[0]).call();
    if (!isActive) return console.log("No active loan found");
    await contract.methods.repayLoan().send({ from: accounts[0], value: amount });
    console.log("Loan repaid");
}

async function withdrawCollateral() {
    const collateralBalance = await contract.methods.getCollateralBalance(accounts[0]).call();
    await contract.methods.withdrawCollateral(collateralBalance).send({ from: accounts[0] });
    console.log("Collateral withdrawn");
}

document.getElementById('connectButton').addEventListener('click', connect);
document.getElementById('depositButton').addEventListener('click', deposit);
document.getElementById('depositCollateralButton').addEventListener('click', depositCollateral);
document.getElementById('createLoanButton').addEventListener('click', createLoan);
document.getElementById('repayLoanButton').addEventListener('click', repayLoan);
document.getElementById('withdrawCollateralButton').addEventListener('click', withdrawCollateral);
