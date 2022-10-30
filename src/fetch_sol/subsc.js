import { getContract, getBalance } from "./utils.js";

async function mintPLMByUser () {
    const { contract } = getContract("PLMExchange");
    const sendTokenAmount = "100";
    const message = await contract.mintPLMByUser({ value: sendTokenAmount });
    console.log({ mintPLMByUser: message });

    return { newCoin: await getBalance() };
}

export { mintPLMByUser };
