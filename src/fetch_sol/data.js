import { getContract, poll } from "./utils.js";

async function getCurrentBondLevel (char, addressIndex) {
    const { contract } = getContract("PLMData", addressIndex);
    const message = await poll(() => {return contract.getCurrentBondLevel(char['level'], char['fromBlock']);});
    console.log({ getCurrentBondLevel: message });
    return message;
}

async function getTypeName (typeId, addressIndex) {
    const { contract } = getContract("PLMData", addressIndex);
    const message = await poll(() => {return contract.getTypeName(typeId);});
    return message;
}

export { getCurrentBondLevel, getTypeName };
