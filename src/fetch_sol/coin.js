import { getContract } from "./utils.js";

async function balanceOf (addressIndex) {
    const { signer, contract } = getContract("PLMCoin", addressIndex);
    const myAddress = await signer.getAddress();
    const message = await contract.balanceOf(myAddress);
    console.log({ balanceOf: message });
    return Number(message);
}

async function approve (contractAddress, approvedCoin, addressIndex) {
    const { signer, contract } = getContract("PLMCoin", addressIndex);
    const message = await contract.approve(contractAddress, approvedCoin);
    console.log({ approve: message });

    const myAddress = await signer.getAddress();
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'Approval' && event.args.owner === myAddress);
    if (event !== undefined) {
        return true;
    } else {
        alert("処理が失敗しました。");
        return false;
    }
}

async function faucet(amount, addressIndex) {
    const { contract } = getContract("PLMCoin", addressIndex);
    const message = await contract.faucet(amount);
    console.log({ faucet: message });
    return amount;
}

export { balanceOf, approve, faucet };
