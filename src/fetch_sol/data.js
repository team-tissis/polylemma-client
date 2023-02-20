import { getContract, poll } from "./utils.js";

async function getCurrentBondLevel (char, addressIndex) {
    const { contract } = getContract("PLMData", addressIndex);
    const response = await poll(() => {return contract.getCurrentBondLevel(char['level'], char['fromBlock']);});
    console.log({ getCurrentBondLevel: response });
    return response;
}

async function getTypeName (typeId, addressIndex) {
    const { contract } = getContract("PLMData", addressIndex);
    const response = await poll(() => {return contract.getTypeName(typeId);});
    return response;
}

export { getCurrentBondLevel, getTypeName };
