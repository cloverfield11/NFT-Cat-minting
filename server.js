// server.js - This file is responsible for starting the Node.js server for our NFT website.
// It serves static files from the /Public directory and handles requests for minting NFTs.

// Import modules for creating a web application.
const express = require('express');
const app = express();
const path = require('path');

// Set up middleware for handling static files from the /Public directory.
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the home page of the website.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define a route for handling requests for minting NFTs.
app.get('/handleMint', async (req, res) => {
  try {
    await handleMint();
    res.send('Minting complete');
  } catch (error) {
    console.error('Error occurred during minting:', error);
    res.status(500).send('Error occurred during minting');
  }
});

// Start the server on port 3000.
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// This function is responsible for minting NFTs. It uses the Web3.js library for
// interacting with the MyNFT smart contract and minting a new NFT. The function also
// uses the Node.js file system to save the index of the last minted NFT.
async function handleMint() {
  const Web3 = require('web3');
  const HDWalletProvider = require('@truffle/hdwallet-provider');
  const MyNFT = require('./contracts/MyNFT.json');
  const mnemonic = 'MNEMONIC'; // Replace this mnemonic phrase with your own mnemonic phrase that will be used to access your wallet.
  const contract_address = 'ADDRESS'; // Replace this address with the address of your deployed MyNFT contract.
  const fs = require('fs');
  const path = require('path');

  const deploy = async () => {
    const filePath = path.join(__dirname, 'lastMintedIndex.txt');

    let lastMintedIndex = 0;
    if (fs.existsSync(filePath)) {
      lastMintedIndex = parseInt(fs.readFileSync(filePath, 'utf8'));
    }    
    const address = 'ADDRESS'; // Get the address of the wallet that will be used for deploying the contract.
    const accounts = await web3Instance.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const contract = new web3Instance.eth.Contract(MyNFT.abi, contract_address);

    const fileList = [
      'QmP8mGwYiMFwSVX5VmkNiELy2TUkd8uTJ5m2nGfv7AMDE4',
      'QmRZFuQktjR99kECkwZRzxUrtuPNtRSZd42oHf65pDkZKP',
      'QmPAfEjvfg3JVG9va3QvQCkLL23BjM8p1ydcfZcKxxHZwW',
      'QmWoZr4wGe7aYmXLygT1iFH2DR74wpxdVJ6rVjFBxTKLAX',
      'QmVt9C5L8R8AVCpCAofxBEzQZhiz9khuZ5ESkzEeqWx9ZE',
      'QmbZknsZv84aG7kcz2He3Ku9TjPFhM6vh21rWhesRf5YkN',    // Get a list of URI addresses of the files that will be used for minting NFTs.
      'QmfL4RF3GgyumfDTsHNTkaErjTRmKUQqFmjMMByoSoCbU9',
      'QmXqapeHfdjGwa6QJ7AUa8qhUJc4kQCjZgwpaP9FQ7vyPa',
      'QmQiRdrKUNycJ61cFii1vBMT2Ntb3sqzPECeJVoc3zTqqR',
      'QmQHpo6cdxcjCAWFcunwXfmxjDZTPUxUTyyyDft3a3YSQ5',
    ];

    const nextIndex = (lastMintedIndex + 1) % fileList.length;
    const fileName = fileList[nextIndex];

    const tokenURI = `https://ipfs.io/ipfs/${fileName}`;
    await contract.methods.mintNFT(address, tokenURI).send({ from: accounts[0] });
    console.log(`NFT ${nextIndex + 1} minted successfully`);
  
    fs.writeFileSync(filePath, nextIndex.toString(), 'utf8');
  };

  const web3Instance = new Web3(new HDWalletProvider(mnemonic, 'https://rpc-mumbai.maticvigil.com'));
  await deploy();
}