import { getContract, approve, balanceOf } from "./utils.js";

async function charge () {
    const { contract } = getContract("PLMDealer");
    const sendMATICAmount = "1" + "0".repeat(20);
    const message = await contract.charge({ value: sendMATICAmount });
    // console.log({ charge: message });
    return { newCoin: await balanceOf() };
}

async function getSubscExpiredBlock () {
    const { signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const message = await contract.getSubscExpiredBlock(myAddress);
    // console.log({ getSubscExpiredBlock: message });
    return message.toString();
}

async function subscIsExpired () {
    const { signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const message = await contract.subscIsExpired(myAddress);
    // console.log({ getSubscIsExpired: message });
    return message.toString();
}

async function getSubscFeePerUnitPeriod () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getSubscFeePerUnitPeriod();
    // console.log({ getSubscFeePerUnitPeriod: message });
    return message.toString();
}

async function extendSubscPeriod () {
    const { contractAddress, signer, contract } = getContract("PLMDealer");
    const myAddress = await signer.getAddress();
    const subscFeePerUnitPeriod = await getSubscFeePerUnitPeriod(myAddress);
    await approve(contractAddress, subscFeePerUnitPeriod);
    const message = await contract.extendSubscPeriod();
    // console.log({ extendSubscPeriod: message });
    return await getSubscExpiredBlock();
}

async function getSubscUnitPeriodBlockNum () {
    const { contract } = getContract("PLMDealer");
    const message = await contract.getSubscUnitPeriodBlockNum();
    // console.log({ getSubscUnitPeriodBlockNum: message });
    return message.toString();
}

export { charge, getSubscExpiredBlock, subscIsExpired, getSubscFeePerUnitPeriod, extendSubscPeriod, getSubscUnitPeriodBlockNum };
