import { Wallet, BigNumber, ethers, providers } from 'ethers';
import {TokenPair} from './TokenPair.js';
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/0acddb4b45384e10b072ea9355bffd2b')

const token0 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' //WETH
const token1 = '0x6b175474e89094c44da98b954eedeac495271d0f' //DAI

const uniRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const sushiRouterAddress = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
const PATH = [token0, token1]

const routerAbi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
] //needs to be implemented

const uniRouter = new ethers.Contract(uniRouterAddress, routerAbi, provider)
const sushiRouter = new ethers.Contract(sushiRouterAddress, routerAbi, provider)

const amountIn = ethers.utils.parseEther('1');

const main = async () => {
    while (true){
        const uniAmount = await uniRouter.getAmountsOut(amountIn,PATH)
        const sushiAmount = await sushiRouter.getAmountsOut(amountIn,PATH)

        const uniPrice = Number(uniAmount[1]) / Number(uniAmount[0])
        const sushiPrice = Number(sushiAmount[1]) / Number(sushiAmount[0])
        console.log("uniprice:", uniPrice)
        console.log("sushiswap:", sushiPrice)

        const TX_FEE = 0

        let effUniPrice
        let effSushiPrice
        let spread

        if (uniPrice>sushiPrice){
            effUniPrice = uniPrice - (uniPrice * TX_FEE)
            effSushiPrice = sushiPrice - (sushiPrice * TX_FEE)
            spread = effUniPrice - effSushiPrice
            console.log("uni to sushi spread: ", spread)
            if (spread>0){
                console.log("sell on uni buy on sushi")
            }else {
                console.log("no arb opportunity")
            }
        } else if (sushiPrice>uniPrice){
            effSushiPrice = sushiPrice - (sushiPrice * TX_FEE)
            effUniPrice = uniPrice + (uniPrice * TX_FEE)
            spread = effSushiPrice - effUniPrice
            console.log("sushi to uni spread: ", spread)
            if (spread>0){
                console.log("sell on sushi buy on uni")
            }else {
                console.log("no arb opportunity")
            }
        }
    }
}
console.log("it works")

//main();
const uniswapFactoryContract = new ethers.Contract(
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    [
        "function allPairsLength() external view returns (uint256)",
        "function allPairs(uint256) external view returns (address pair)",
    ],
    provider
);
const allPairsLength = await uniswapFactoryContract.allPairsLength();
const sushiswapFactoryContract = new ethers.Contract(
    "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
    [
        "function allPairsLength() external view returns (uint256)",
        "function allPairs(uint256) external view returns (address pair)",
    ],
    provider
);
const allSushiswapPairsLength = await sushiswapFactoryContract.allPairsLength();

const allTokens = [];

for (let i = 0; i < allPairsLength; i++) {
    //Pair Constract
    const pairAddress = await uniswapFactoryContract.allPairs(i);
    const pairContract = new ethers.Contract(pairAddress, [
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
        "function symbol() external view returns (string)"
    ], provider);

    const token0Address = await pairContract.token0();
    const token1Address = await pairContract.token1();
    const pairSymbol = await pairContract.symbol();

    //Tokens Contracts
    const token0Contract = new ethers.Contract(token0, [
        "function name() external view returns (string)",
        "function symbol() external view returns (string)"
    ], provider);

    const token1Contract = new ethers.Contract(token1, [
        "function name() external view returns (string)",
        "function symbol() external view returns (string)"
    ], provider);

    const token0Name = await token0Contract.name();
    const token1Name = await token1Contract.name();
    const token0Symbol = await token0Contract.symbol();
    const token1Symbol = await token1Contract.symbol();

    const PATH = [token0Address, token1Address]

    const uniAmount = await uniRouter.getAmountsOut(amountIn,PATH)
    const sushiAmount = await sushiRouter.getAmountsOut(amountIn,PATH)

    const uniPrice = Number(uniAmount[1]) / Number(uniAmount[0])
    const sushiPrice = Number(sushiAmount[1]) / Number(sushiAmount[0])
    console.log("uniprice:", uniPrice)
    console.log("sushiswap:", sushiPrice)

    const TX_FEE = 0

    let effUniPrice
    let effSushiPrice
    let spread

    if (uniPrice>sushiPrice){
        effUniPrice = uniPrice - (uniPrice * TX_FEE)
        effSushiPrice = sushiPrice - (sushiPrice * TX_FEE)
        spread = effUniPrice - effSushiPrice
        console.log("uni to sushi spread: ", spread)
        if (spread>0){
            console.log("sell on uni buy on sushi")
        }else {
            console.log("no arb opportunity")
        }
    } else if (sushiPrice>uniPrice){
        effSushiPrice = sushiPrice - (sushiPrice * TX_FEE)
        effUniPrice = uniPrice + (uniPrice * TX_FEE)
        spread = effSushiPrice - effUniPrice
        console.log("sushi to uni spread: ", spread)
        if (spread>0){
            console.log("sell on sushi buy on uni")
        }else {
            console.log("no arb opportunity")
        }
    }


    /*let tokenPair;
    tokenPair = new TokenPair(pairAddress,token0Address,token1Address,token0Symbol,token1Symbol,pairSymbol);
    allTokens.push(tokenPair);*/
    /*console.log(pairAddress)
    console.log(token0Address)
    console.log(token1Address)
    console.log(token0Symbol)
    console.log(token1Symbol)
    console.log(pairSymbol)*/





}

for (let i = 0; i < allSushiswapPairsLength; i++) {
    const pairAddress = await sushiswapFactoryContract.allPairs(i);
    const pairContract = new ethers.Contract(pairAddress, [
        "function token0() external view returns (address)",
        "function token1() external view returns (address)",
    ], provider);

    const token0Address = await pairContract.token0();
    const token1Address = await pairContract.token1();

    let tokenPair;
    tokenPair = new TokenPair(pairAddress,token1Address,"","",symbol);
    allTokens.push(tokenPair);
}

console.log(allTokens);