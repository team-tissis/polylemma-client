import { getEnv, getContract } from "./utils.js";
import { approve, faucet } from "./coin.js";

///////////////////////////////
/// FUNCTIONS ABOUT STAMINA ///
///////////////////////////////

async function restoreFullStamina (addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const restoreStaminaFee = await getRestoreStaminaFee(addressIndex);
    if (await approve(contractAddress, restoreStaminaFee)) {
        const message = await contract.restoreFullStamina(myAddress);
        console.log({ restoreFullStamina: message });
    } else {
        return -1;
    }
}

async function getCurrentStamina (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getCurrentStamina(myAddress);
    console.log({ getCurrentStamina: message });
    return message;
}

async function getStaminaMax (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getStaminaMax();
    console.log({ getStaminaMax: message });
    return message;
}

async function getStaminaPerBattle (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getStaminaPerBattle();
    console.log({ getStaminaPerBattle: message });
    return message;
}

async function getRestoreStaminaFee (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getRestoreStaminaFee();
    console.log({ getRestoreStaminaFee: message });
    return Number(message);
}

////////////////////////////////////
/// FUNCTIONS ABOUT SUBSCRIPTION ///
////////////////////////////////////

async function subscIsExpired (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.subscIsExpired(myAddress);
    console.log({ getSubscIsExpired: message });
    return message;
}

async function extendSubscPeriod (addressIndex) {
    const { contractAddress, signer, contract } = getContract("PLMDealer", addressIndex);
    const subscFeePerUnitPeriod = await getSubscFeePerUnitPeriod(addressIndex);
    if (await approve(contractAddress, subscFeePerUnitPeriod, addressIndex)) {
        const message = await contract.extendSubscPeriod();
        console.log({ extendSubscPeriod: message });

        const myAddress = await signer.getAddress();
        const rc = await message.wait();
        const event = rc.events.find(event => event.event === 'SubscExtended' && event.args.account === myAddress);
        if (event !== undefined) {
            const { extendedBlock } = event.args;
            return extendedBlock;
        } else {
            alert("処理が失敗しました。");
            return -1;
        }
    } else {
        return -1;
    }
}

async function getSubscExpiredBlock (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getSubscExpiredBlock(myAddress);
    console.log({ getSubscExpiredBlock: message });
    return message.toString();
}

async function getSubscRemainingBlockNum (addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.getSubscRemainingBlockNum(myAddress);
    console.log({ getSubscRemainingBlockNum: message });
    return message.toString();
}

async function getSubscFeePerUnitPeriod (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getSubscFeePerUnitPeriod();
    console.log({ getSubscFeePerUnitPeriod: message });
    return Number(message);
}

async function getSubscUnitPeriodBlockNum (addressIndex) {
    const { contract } = getContract("PLMDealer", addressIndex);
    const message = await contract.getSubscUnitPeriodBlockNum();
    console.log({ getSubscUnitPeriodBlockNum: message });
    return message.toString();
}

//////////////////////////////////
/// FUNCTIONS ABOUT CHARGEMENT ///
//////////////////////////////////

async function charge (amount, addressIndex) {
    const { signer, contract } = getContract("PLMDealer", addressIndex);
    const sendMATICAmount = amount.toString() + "0".repeat(18);
    const message = await contract.charge({ value: sendMATICAmount });
    console.log({ charge: message });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'AccountCharged' && event.args.charger === myAddress);
    if (event !== undefined) {
        const { chargeAmount, poolingAmount } = event.args;
        return Number(chargeAmount.sub(poolingAmount));
    } else {
        alert("処理が失敗しました。");
        return -1;
    }
}

async function getPLMCoin (plm, matic, addressIndex) {
    if (getEnv() === 'local') {
        return await charge(matic, addressIndex);
    } else if (getEnv() === 'mumbai') {
        return await faucet(plm, addressIndex);
    }
}

export { restoreFullStamina, getCurrentStamina, getStaminaMax, getStaminaPerBattle, getRestoreStaminaFee,
         subscIsExpired, extendSubscPeriod, getSubscExpiredBlock, getSubscRemainingBlockNum, getSubscFeePerUnitPeriod, getSubscUnitPeriodBlockNum,
         getPLMCoin };
