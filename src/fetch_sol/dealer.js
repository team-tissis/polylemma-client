import { getContract } from "./utils.js";
import { approve } from "./coin.js";

///////////////////////////////
/// FUNCTIONS ABOUT STAMINA ///
///////////////////////////////

async function getCurrentStamina () {
    const { signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const message = contract.getCurrentStamina(myAddress);
    console.log({ getCurrentStamina: message });
    return message.toString();
}

async function getStaminaMax () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getStaminaMax();
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
    const restoreStaminaFee = await getRestoreStaminaFee(myAddress);
    await approve(contractAddress, restoreStaminaFee);
    const message = await contract.restoreFullStamina(myAddress);
    console.log({ restoreFullStamina: message });
}

async function consumeStaminaForBattle () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.consumeStaminaForBattle();
    console.log({ consumeStaminaForBattle: message });
}

////////////////////////////////////
/// FUNCTIONS ABOUT SUBSCRIPTION ///
////////////////////////////////////

async function getSubscExpiredBlock () {
    const { signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const message = await contract.getSubscExpiredBlock(myAddress);
    console.log({ getSubscExpiredBlock: message });
    return message.toString();
}

async function subscIsExpired () {
    const { signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const message = await contract.subscIsExpired(myAddress);
    console.log({ getSubscIsExpired: message });
    return message.toString();
}

async function getSubscFeePerUnitPeriod () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getSubscFeePerUnitPeriod();
    console.log({ getSubscFeePerUnitPeriod: message });
    return message.toString();
}

async function getSubscUnitPeriodBlockNum () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getSubscUnitPeriodBlockNum();
    console.log({ getSubscUnitPeriodBlockNum: message });
    return message.toString();
}

async function extendSubscPeriod () {
    const { contractAddress, signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const subscFeePerUnitPeriod = await getSubscFeePerUnitPeriod(myAddress);
    await approve(contractAddress, subscFeePerUnitPeriod);
    const message = await contract.extendSubscPeriod();
    console.log({ extendSubscPeriod: message });
    return await getSubscExpiredBlock();
}

//////////////////////////////////
/// FUNCTIONS ABOUT CHARGEMENT ///
//////////////////////////////////

async function charge () {
    const { contract } = getContract("PLMDealer");
    const sendMATICAmount = "1" + "0".repeat(20);
    const message = await contract.charge({ value: sendMATICAmount });
    console.log({ charge: message });
}

async function accountCharged (setAddedCoin) {
    const { signer, contract } = getContract("PLMDealer");
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
