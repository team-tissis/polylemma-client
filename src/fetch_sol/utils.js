import { ethers } from "ethers";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import dealerArtifact from "../abi/PLMDealer.sol/PLMDealer.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";
import matchOrganizerArtifact from "../abi/PLMMatchOrganizer.sol/PLMMatchOrganizer.json";
import battleFieldArtifact from "../abi/PLMBattleField.sol/PLMBattleField.json";

// const env = 'local';
const env = 'mumbai';

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
    return ethers.BigNumber.from(ethers.utils.solidityKeccak256(["bytes32", "bytes32"], [nonce, seed])).mod(mod).toNumber() + 1;
}

function getCommitString (myAddress, levelPoint, choice, blindingFactor) {
    return ethers.utils.solidityKeccak256(["address", "uint8", "uint8", "bytes32"], [myAddress, levelPoint, choice, blindingFactor]);
}

// スマコンのアドレスを取得
function getContractAddress (contractName) {
    if (env === 'local') {
        const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
        return contractAddress;
    } else if (env === 'mumbai') {
        if (contractName === "PLMCoin") return "0x3339F7b5a9732A89A97784da603db81e4e36De21";
        else if (contractName === "PLMToken") return "0xB26c1c4F3943632C5320e81154DEde5F70541F8d";
        else if (contractName === "PLMDealer") return "0x7DE60Bfe97DBF9e187cC60968abD5Ee86551041B";
        else if (contractName === "PLMMatchOrganizer") return "0xcC1E6B11FBB87b8Bb8b33A8fB3261A0DaEb7fda6";
        else if (contractName === "PLMBattleField") return "0x6a4ED9Ac7f80222df4683B15acEB7996fa98ec2A";
    }
}

function getAbi (contractName) {
    if (contractName === "PLMCoin") return coinArtifact.abi;
    else if (contractName === "PLMDealer") return dealerArtifact.abi;
    else if (contractName === "PLMToken") return tokenArtifact.abi;
    else if (contractName === "PLMMatchOrganizer") return matchOrganizerArtifact.abi;
    else if (contractName === "PLMBattleField") return battleFieldArtifact.abi;
}

function getSigner (addressIndex) {
    if (env === 'local') {
        const signerIndex = (addressIndex == null) ? 1 : addressIndex;
        const provider = new ethers.providers.JsonRpcProvider();
        const signer = provider.getSigner(signerIndex);
        return signer;
    } else if (env === 'mumbai') {
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

export { stringToBytes32, bytes32ToString, getRandomBytes32, getSeedString, calcRandomSlotId, getCommitString, getContract };
