import { getContract, poll } from "./utils.js";

async function balanceOf (addressIndex) {
    const { signer, contract } = getContract("PLMCoin", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await poll(() => {return contract.balanceOf(myAddress);});
    console.log({ balanceOf: message });
    return Number(message);
}

async function approve (contractAddress, approvedCoin, addressIndex) {
    const { contract } = getContract("PLMCoin", addressIndex);
    const message = await poll(() => {return contract.approve(contractAddress, approvedCoin);});
    console.log({ approve: message });
    await message.wait();
}

async function faucet(amount, addressIndex) {
    const { contract } = getContract("PLMCoin", addressIndex);
    const message = await poll(() => {return contract.faucet(amount);});
    console.log({ faucet: message });
    await message.wait();
    return amount;
}

export { balanceOf, approve, faucet };
