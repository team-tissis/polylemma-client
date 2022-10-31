import { getContract, getBalance } from "./utils.js";

async function mintPLMByUser () {
    const { contract } = getContract("PLMExchange");
    const sendTokenAmount = "100";
    const message = await contract.mintPLMByUser({ value: sendTokenAmount });
    console.log({ mintPLMByUser: message });
    
    return { newCoin: await getBalance() };
}

async function getSubscExpiredPoint () {
    const { signer, contract } = getContract("PLMCoin");
    const myAddress = await signer.getAddress();
    const message = await contract.getSubscExpiredPoint(myAddress);
    console.log({ getSubscExpiredPoint: message });

    return message.toString();
}

async function subscIsExpired () {
    const { signer, contract } = getContract("PLMCoin");
    const myAddress = await signer.getAddress();
    const message = await contract.subscIsExpired(myAddress);
    console.log({ getSubscIsExpired: message });

    return message.toString();
}

async function getSubscFee () {
    const { contract } = getContract("PLMCoin");
    const message = await contract.getSubscFee();
    console.log({ getSubscFee: message });

    return message.toString();
}

async function updateSubsc () {
    const { contract } = getContract("PLMCoin");
    const message = await contract.updateSubsc();
    console.log({ updateSubsc: message });

    return await getSubscExpiredPoint();
}

async function getSubscDuration () {
    const { contract } = getContract("PLMCoin");
    const message = await contract.getSubscDuration();
    console.log({ getSubscDuration: message });

    return message.toString();
}

export { mintPLMByUser, getSubscExpiredPoint, subscIsExpired, getSubscFee, updateSubsc, getSubscDuration };
