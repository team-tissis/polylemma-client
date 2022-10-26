import { ethers } from "ethers";
import gachaArtifact from "../abi/PLMGacha.sol/PLMGacha.json";
import coinArtifact from "../abi/PLMCoin.sol/PLMCoin.json";
import { getContractAddress, getBalance, getTotalSupply } from "./utils.js";

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();

async function mintCoin () {
    const coinContractAddress = getContractAddress("PLMCoin");
    const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { mint } = contractWithSigner.functions;
    const message = await mint(0);

    const myAddress = await signer.getAddress();

    // event の listen v1
    // 本当はこのやり方でやりたいがなぜか動かない (.on の中身が実行されている様子がない)
    // const filter = contract.filters.MintDebug(null, myAddress);
    // contract.on(filter, (amount, user) => {
    //     console.log(`${user} got ${amount}.`);
    // });

    // event の listen v2
    // 一応これで動くが、あまり綺麗じゃない
    const rc = await message.wait();
    const event = rc.events.find(event => event.event === 'MintDebug' && event.args.user == myAddress);
    const [ amount, user ] = event.args;
    console.log(`${user} got ${amount.toString()}.`);
    // event の listen 終了

    console.log({ mint: message });
    return { newCoin: await getBalance() };
}

async function handleApprove (gachaContractAddress) {
    const coinContractAddress = getContractAddress("PLMCoin");
    const contract = new ethers.Contract(coinContractAddress, coinArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { approve } = contractWithSigner.functions;
    const gachaCoin = 10000;
    const message = await approve(gachaContractAddress, gachaCoin);
    console.log({ approve: message });
}

async function playGacha () {
    const gachaContractAddress = getContractAddress("PLMGacha");
    await handleApprove(gachaContractAddress);
    const contract = new ethers.Contract(gachaContractAddress, gachaArtifact.abi, provider);
    const contractWithSigner = contract.connect(signer);
    const { gacha } = contractWithSigner.functions;
    const message = await gacha();

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
