import { getContract, handleApprove, getBalance } from "./utils.js";

async function getCurrentStamina () {
    const { signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const message = contract.getCurrentStamina(myAddress);
    console.log({ getCurrentStamina: message });
    return message.toString();
}

async function getStaminaMax () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getStaminaMax(tokenId);
    console.log({ getStaminaMax: message });
    return message.toString();
}

async function getStaminaPerBattle () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getStaminaPerBattle();
    console.log({ getStaminaPerBattle: message });
    return message.toString();
}

async function getRestoreStaminaFee () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getRestoreStaminaFee();
    console.log({ getRestoreStaminaFee: message });
    return message.toString();
}

async function restoreFullStamina () {
    const { contractAddress, signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const coinForStamina = await getRestoreStaminaFee(myAddress);
    await handleApprove(contractAddress, coinForStamina);
    const message = await contract.gacha();
    console.log({ restoreFullStamina: message });
    return { newCoin: await getBalance(), newStamina: await getCurrentStamina() };
}

export { getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee, restoreFullStamina };
