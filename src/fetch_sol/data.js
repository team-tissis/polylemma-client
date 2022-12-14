import { getContract } from "./utils.js";

async function getCurrentBondLevel (char, addressIndex) {
    const { contract } = getContract("PLMData", addressIndex);
    const message = await contract.getCurrentBondLevel(char['level'], char['fromBlock']);
    console.log({ getCurrentBondLevel: message });
    return message;
}

async function getTypeName (typeId, addressIndex) {
    const { contract } = getContract("PLMData", addressIndex);
    const message = await contract.getTypeName(typeId);
    console.log({ getTypeName: message });
    return message;
}

export { getCurrentBondLevel, getTypeName };
