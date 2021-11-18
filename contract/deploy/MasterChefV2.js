const { ChainId } = require("@sushiswap/sdk")


const SUSHI = {
  [ChainId.MATIC]: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
  [ChainId.RINKEBY]:"0x07FB41265400A4aBA6392eeACe65282C446F6cA8"
}

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  // let sushiAddress;

  const sushiAddress = (await deployments.get("SushiToken")).address;
  console.log('sushiAddress:',sushiAddress)

  const masterChefAddress = (await deployments.get("MasterChef")).address;
  console.log('masterChefAddress:',masterChefAddress)


  // if (chainId === '31337') {
  //   sushiAddress = (await deployments.get("SushiToken")).address
  // } else if (chainId in SUSHI) {
  //   sushiAddress = SUSHI[chainId]
  // } else {
  //   throw Error("No SUSHI!")
  // }

  await deploy("MasterChefV2", {
    from: deployer,
    args: [masterChefAddress,sushiAddress,250],
    log: true,
    deterministicDeployment: false
  })

  const masterChefV2 = await ethers.getContract("MasterChefV2")
  if (await masterChefV2.owner() !== dev) {
    console.log("Transfer ownership of MasterChefV2 to dev")
    await (await masterChefV2.transferOwnership(dev, true, false)).wait()
  }
}

module.exports.tags = ["MasterChefV2"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
