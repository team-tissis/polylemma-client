import { getContract } from "./utils.js";
import { approve } from "./coin.js";

///////////////////////////////
/// FUNCTIONS ABOUT STAMINA ///
///////////////////////////////

async function getCurrentStamina (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getCurrentStamina(myAddress);
    console.log({ getCurrentStamina: message });
    return message.toString();
}

async function getStaminaMax (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getStaminaMax();
    console.log({ getStaminaMax: message });
    return message.toString();
}

async function getStaminaPerBattle (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getStaminaPerBattle();
    console.log({ getStaminaPerBattle: message });
    return message.toString();
}

async function getRestoreStaminaFee (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getRestoreStaminaFee();
    console.log({ getRestoreStaminaFee: message });
    return message.toString();
}

async function restoreFullStamina (addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const restoreStaminaFee = await getRestoreStaminaFee(addressIndex);
    await approve(contractAddress, restoreStaminaFee);
    const message = await contract.restoreFullStamina(myAddress);
    console.log({ restoreFullStamina: message });
}

async function consumeStaminaForBattle (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.consumeStaminaForBattle();
    console.log({ consumeStaminaForBattle: message });
}

////////////////////////////////////
/// FUNCTIONS ABOUT SUBSCRIPTION ///
////////////////////////////////////

async function getSubscExpiredBlock (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getSubscExpiredBlock(myAddress);
    console.log({ getSubscExpiredBlock: message });
    return message.toString();
}

async function subscIsExpired (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.subscIsExpired(myAddress);
    console.log({ getSubscIsExpired: message });
    return message.toString();
}

async function getSubscFeePerUnitPeriod (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getSubscFeePerUnitPeriod();
    console.log({ getSubscFeePerUnitPeriod: message });
    return message.toString();
}

async function getSubscUnitPeriodBlockNum (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getSubscUnitPeriodBlockNum();
    console.log({ getSubscUnitPeriodBlockNum: message });
    return message.toString();
}

async function extendSubscPeriod (addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const subscFeePerUnitPeriod = await getSubscFeePerUnitPeriod(addressIndex);
    await approve(contractAddress, subscFeePerUnitPeriod, addressIndex);
    const message = await contract.extendSubscPeriod();
    console.log({ extendSubscPeriod: message });
}

//////////////////////////////////
/// FUNCTIONS ABOUT CHARGEMENT ///
//////////////////////////////////

async function charge (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const sendMATICAmount = "1" + "0".repeat(20);
    const message = await contract.charge({ value: sendMATICAmount });
    console.log({ charge: message });
}

async function accountCharged (setAddedCoin, addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const filter = contract.filters.AccountCharged(myAddress, null, null);
    contract.on(filter, (charger, chargeAmount, poolingAmount) => {
        console.log(`${charger} got ${chargeAmount - poolingAmount}.`);
        setAddedCoin(chargeAmount - poolingAmount);
    });
}

export { getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee, restoreFullStamina, consumeStaminaForBattle,
         getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod, getSubscUnitPeriodBlockNum, extendSubscPeriod,
         charge, accountCharged };
