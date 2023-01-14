import { ethers } from "ethers";
import contractFunctions from "../broadcast/Polylemma.s.sol/31337/run-latest.json";
// import contractFunctions from "../json/contract_address_list.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import dealerArtifact from "../abi/PLMDealer.sol/PLMDealer.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";
import dataArtifact from "../abi/PLMData.sol/PLMData.json";
import matchOrganizerArtifact from "../abi/PLMMatchOrganizer.sol/PLMMatchOrganizer.json";
import battleFieldArtifact from "../abi/PLMBattleField.sol/PLMBattleField.json";

function getEnv() {
    return 'local';
    // return 'mumbai';
}

function stringToBytes32 (str) {
    return ethers.utils.formatBytes32String(str);
}

function bytes32ToString (bytes) {
    return ethers.utils.parseBytes32String(bytes);
}

function getRandomBytes32 () {
    return ethers.utils.hexlify(ethers.utils.randomBytes(32));
}

function getSeedString (myAddress, seed) {
    return ethers.utils.solidityKeccak256(["address", "bytes32"], [myAddress, seed]);
}

function calcRandomSlotId (nonce, seed, mod) {
    return Number(ethers.BigNumber.from(ethers.utils.solidityKeccak256(["bytes32", "bytes32"], [nonce, seed])).mod(mod)) + 1;
}

function getCommitString (myAddress, levelPoint, choice, blindingFactor) {
    return ethers.utils.solidityKeccak256(["address", "uint8", "uint8", "bytes32"], [myAddress, levelPoint, choice, blindingFactor]);
}

// スマコンのアドレスを取得
function getContractAddress (contractName) {
    if (getEnv() === 'local') {
        const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
        return contractAddress;
    } else if (getEnv() === 'mumbai') {
        const contractAddress = contractFunctions.contracts.find((v) => v.contractName === contractName).contractAddress;
        return contractAddress;
    }
}

function getAbi (contractName) {
    if (contractName === "PLMCoin") return coinArtifact.abi;
    else if (contractName === "PLMDealer") return dealerArtifact.abi;
    else if (contractName === "PLMToken") return tokenArtifact.abi;
    else if (contractName === "PLMData") return dataArtifact.abi;
    else if (contractName === "PLMMatchOrganizer") return matchOrganizerArtifact.abi;
    else if (contractName === "PLMBattleField") return battleFieldArtifact.abi;
}

function getSigner (addressIndex) {
    if (getEnv() === 'local') {
        const signerIndex = (addressIndex == null) ? 1 : addressIndex;
        const provider = new ethers.providers.JsonRpcProvider();
        const signer = provider.getSigner(signerIndex);
        return signer;
    } else if (getEnv() === 'mumbai') {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
            const signer = provider.getSigner();
            return signer;
        } catch (e) {
            console.log({error: e});
            alert("Chrome に MetaMask をインストールしてください。");
        }
    }
}

function getContract (contractName, addressIndex) {
    const contractAddress = getContractAddress(contractName);
    const abi = getAbi(contractName);
    const signer = getSigner(addressIndex);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return { contractAddress, signer, contract };
}

async function connectWallet () {
    if (getEnv() === 'mumbai') {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        return await signer.getAddress();
    }
    return null;
}

export { getEnv, stringToBytes32, bytes32ToString, getRandomBytes32, getSeedString, calcRandomSlotId, getCommitString, getContract, connectWallet };
