import { ethers } from "ethers";
import contractFunctions from "../broadcast/PLMGachaScript.s.sol/31337/run-latest.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import dealerArtifact from "../abi/PLMDealer.sol/PLMDealer.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";
import matchOrganizerArtifact from "../abi/PLMMatchOrganizer.sol/PLMMatchOrganizer.json";
import battleFieldArtifact from "../abi/PLMBattleField.sol/PLMBattleField.json";

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
    // const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
    // return contractAddress;

    if (contractName === "PLMCoin") return "0x469B5262dbF80dfff0b4b84703ffAF88853850fA";
    else if (contractName === "PLMToken") return "0x76944d941a6B3839823d2cc30CEeEE4a52eBc6a4";
    else if (contractName === "PLMDealer") return "0x797FF27dBC5C140189fD06b320c0Ad0FC0fFEDC2";
    else if (contractName === "PLMMatchOrganizer") return "0x3030997522C52723954d7DD06A132c45EdE6B150";
    else if (contractName === "PLMBattleField") return "0xb644F7722AeCdCcF136CcE979Ec634Eb332e1560";
}

function getAbi (contractName) {
    if (contractName === "PLMCoin") return coinArtifact.abi;
    else if (contractName === "PLMDealer") return dealerArtifact.abi;
    else if (contractName === "PLMToken") return tokenArtifact.abi;
    else if (contractName === "PLMMatchOrganizer") return matchOrganizerArtifact.abi;
    else if (contractName === "PLMBattleField") return battleFieldArtifact.abi;
}

async function getSigner (addressIndex) {
    // const signerIndex = (addressIndex == null) ? 1 : addressIndex;
    // // (多分) MetaMask を経由しないで使う方法
    // const provider = new ethers.providers.JsonRpcProvider();
    // const signer = provider.getSigner(signerIndex);
    // MetaMask を使う方法 (うまくいかない)
    const provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    return signer;
}

async function getContract (contractName, addressIndex) {
    const contractAddress = getContractAddress(contractName);
    const abi = getAbi(contractName);
    const signer = await getSigner(addressIndex);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return { contractAddress, signer, contract };
}

export { stringToBytes32, bytes32ToString, getRandomBytes32, getSeedString, calcRandomSlotId, getCommitString, getContract };
