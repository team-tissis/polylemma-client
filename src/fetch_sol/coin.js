import { getContract, poll } from "./utils.js";

async function balanceOf (addressIndex) {
    const { signer, contract } = getContract("PLMCoin", addressIndex);
    const myAddress = await signer.getAddress();
    const response = await poll(() => {return contract.balanceOf(myAddress);});
    console.log({ balanceOf: response });
    return Number(response);
}

async function approve (contractAddress, approvedCoin, addressIndex) {
    const { contract } = getContract("PLMCoin", addressIndex);
    const response = await poll(() => {return contract.approve(contractAddress, approvedCoin);});
    console.log({ approve: response });
    await response.wait();
}

async function faucet(amount, addressIndex) {
    const { contract } = getContract("PLMCoin", addressIndex);
    const response = await poll(() => {return contract.faucet(amount);});
    console.log({ faucet: response });
    await response.wait();
    return amount;
}

export { balanceOf, approve, faucet };
