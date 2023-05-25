import { ethers } from "ethers";
import contractFunctions from "../broadcast/Polylemma.s.sol/31337/run-latest.json";
// import contractFunctions from "../json/contract_address_list_latest.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import dealerArtifact from "../abi/PLMDealer.sol/PLMDealer.json";
import tokenArtifact from "../abi/PLMToken.sol/PLMToken.json";
import dataArtifact from "../abi/PLMData.sol/PLMData.json";
import matchOrganizerArtifact from "../abi/PLMMatchOrganizer.sol/PLMMatchOrganizer.json";
import battleFieldArtifact from "../abi/PLMBattleField.sol/PLMBattleField.json";
import battleManagerArtifact from "../abi/PLMBattleManager.sol/PLMBattleManager.json";
// abi/PLMBattleManager.sol/PLMBattleManager.json
import battleStarterArtifact from "../abi/PLMBattleStarter.sol/PLMBattleStarter.json";
import battlePlayerSeedArtifact from "../abi/PLMBattlePlayerSeed.sol/PLMBattlePlayerSeed.json";
import battleChoiceArtifact from "../abi/PLMBattleChoice.sol/PLMBattleChoice.json";

import { ExponentialBackoff } from './backoff.ts';

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
    // broadcast/Polylemma.s.sol/31337/run-latest.json に "PLMBattleField" の登録がない
    if(contractName == "PLMBattleField"){
        return "0xf47D872E47d2f2E24449192EfB844e2D4d77f0DC"
    }
    
    const contractAddress = contractFunctions.transactions.find((v) => v.contractName === contractName).contractAddress;
    return contractAddress;
}

function getAbi (contractName) {
    if (contractName === "PLMCoin") return coinArtifact.abi;
    else if (contractName === "PLMDealer") return dealerArtifact.abi;
    else if (contractName === "PLMToken") return tokenArtifact.abi;
    else if (contractName === "PLMData") return dataArtifact.abi;
    else if (contractName === "PLMMatchOrganizer") return matchOrganizerArtifact.abi;
    else if (contractName === "PLMBattleField") return battleFieldArtifact.abi;
    else if (contractName === "PLMBattleManager") return battleManagerArtifact.abi;
    else if (contractName === "PLMBattleStarter") return battleStarterArtifact.abi;
    else if (contractName === "PLMBattlePlayerSeed") return battlePlayerSeedArtifact.abi;
    else if (contractName === "PLMBattleChoice") return battleChoiceArtifact.abi;
}

async function getMyAddress(addressIndex) {
    const signer = await getSigner(addressIndex)
    return signer.getAddress()
}

function switchAccount (){
    // 現在のポートが3000の場合は index 1を使用する
    // 現在のポートが3001の場合は index 2を使用する
    const nameUrl = window.location.href
    if (nameUrl.includes("http://localhost:3000")) {
        return 1
    }
    if (nameUrl.includes("http://localhost:3001")) {
        return 2
    }
    if (nameUrl.includes("http://localhost:3002")) {
        return 3
    }
}

function getSigner (addressIndex) {
    if (getEnv() === 'local') {
        const signerIndex = (addressIndex == null) ? switchAccount() : addressIndex;
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
        const response = await provider.send('eth_requestAccounts', []);
        return response[0];
    }
    return null;
}

async function poll(func) {
    const maxAttempts = 1;
    const backoff = new ExponentialBackoff(maxAttempts);
    let ans;
    try {
        for (let i = 0; i < maxAttempts + 1; i++) {
            try {
                ans = await func();
                return ans;
            } catch (e) {
                if (e.message.indexOf("Your app has exceeded its compute units per second capacity.") === -1) {
                    console.log({error: e});
                    throw e;
                }
                console.log(`${i}: ${func}`);
                await backoff.backoff();
            }
        }
    } catch (e) {
        if (e.message.indexOf("Your app has exceeded its compute units per second capacity.") === -1) {
            console.log(`Exceeded maximum number of attempts: ${func}.`);
        }
        throw e;
    }
    return ans;
}

export { getEnv, stringToBytes32, bytes32ToString, getRandomBytes32, getSeedString, getMyAddress, calcRandomSlotId, getCommitString, getContract, connectWallet, poll };
