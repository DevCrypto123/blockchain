export class TokenPair {
    constructor(tokenPairAddress,token0Address, token1Address, token0Name, token1Name, tokenPairName) {
        this.tokenPairAddress = tokenPairAddress;
        this.token0Address = token0Address;
        this.token0Name = token0Name;
        this.token1Name = token1Name;
        this.token1Address = token0Address;
        this.tokenPairName = tokenPairName;
    }

    // Getters
    getTokenPairAddress() {
        return this.tokenPairAddress;
    }

    gettoken0Address() {
        return this.token0Address;
    }

    gettoken0Name() {
        return this.token0Name;
    }

    gettoken1Name() {
        return this.token1Name;
    }

    gettoken1Address() {
        return this.token1Address;
    }

    getTokenPairName() {
        return this.tokenPairName;
    }

    // Setters
    setTokenPairAddress(tokenPairAddress) {
        this.tokenPairAddress = tokenPairAddress;
    }

    settoken0Address(token0Address) {
        this.token0Address = token0Address;
    }

    settoken0Name(token0Name) {
        this.token0Name = token0Name;
    }

    settoken1Name(token1Name) {
        this.token1Name = token1Name;
    }

    settoken1Address(token1Address) {
        this.token1Address = token1Address;
    }

    setTokenPairName(tokenPairName) {
        this.tokenPairName = tokenPairName;
    }
}
