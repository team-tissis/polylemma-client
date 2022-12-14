import { ethers } from "ethers";
import contractFunctions from "../broadcast/Polylemma.s.sol/31337/run-latest.json";
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
        if (contractName === "PLMCoin") return "0xA0dcb1F996CB1335D4356C944C7168EE75a94953";
        else if (contractName === "PLMToken") return "0xCF8D3345dd90B218b9F428562fe5985dC4AcDd56";
        else if (contractName === "PLMDealer") return "0x38CE8D774a9fcb04Fa9AfeE5B0d0B82B7824857f";
        else if (contractName === "PLMMatchOrganizer") return "0xD60a1442Fd07b45f8161515A3E8f392DdcCD1661";
        else if (contractName === "PLMBattleField") return "0xa8F64D2Cd2F0597B586BFcfc940a49C9f2ea1247";
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
        const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
        const signer = provider.getSigner();
        return signer;
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
