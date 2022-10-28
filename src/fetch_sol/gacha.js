import { ethers } from "ethers";
import gachaArtifact from "../abi/PLMGacha.sol/PLMGacha.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import { getContract, handleApprove, getBalance, getTotalSupply } from "./utils.js";

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(1);
// const provider = new ethers.providers.Web3Provider(window.ethereum, 31337);
// const signer = provider.getSigner();

async function mintCoin () {
    // const coinContractAddress = getContractAddress("PLMCoin");
    // const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, signer);
    // const message = await contract.mint(100);

    const { signer, contract } = getContract("PLMCoin");
    const message = await contract.mint(100);

    const myAddress = await signer.getAddress();

    // event の listen v1
    // 本当はこのやり方でやりたいがなぜか動かない (.on の中身が実行されている様子がない)
    // const filter = contract.filters.mintDebug(null, myAddress);
    // contract.on(filter, (amount, user) => {
    //     console.log(`${user} got ${amount}.`);
    // });

    // event の listen v2
    // 一応これで動くが、あまり綺麗じゃない
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'mintDebug' && event.args.user == myAddress);
    if (event != undefined) {
        const [ amount, user ] = event.args;
        console.log(`${user} got ${amount.toString()}.`);
    }
    // event の listen 終了

    console.log({ mint: message });
    return { newCoin: await getBalance() };
}

async function playGacha () {
    // const gachaContractAddress = getContractAddress("PLMGacha");
    // const contract = new ethers.Contract(gachaContractAddress, gachaArtifact.abi, signer);
    // await handleApprove(gachaContractAddress, 5);
    // const message = await contract.gacha();

    const { contractAddress, contract } = getContract("PLMGacha");
    await handleApprove(contractAddress, 5);
    const message = await contract.gacha();


    // スマコンの実装待ち
    // const rc = await message.wait();
    // const event = rc.events.find(event => event.event === 'CharacterRecievedByUser' && event.args.user == myAddress);
    // const [ user, tokenId, characterInfo ] = event.args;
    // console.log(`${user} got ${tokenId.toString()}.`);
    const tokenId = 0;

    console.log({ gacha: message });
    return { newCoin: await getBalance(), newToken: await getTotalSupply(), newTokenId:  tokenId };
}

export { mintCoin, playGacha };
