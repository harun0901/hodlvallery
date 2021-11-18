// Defining bytecode and abi from original contract on mainnet to ensure bytecode matches and it produces the same pair code hash
const {
  bytecode,
  abi,
} = require("../deployments/mainnet/UniswapV2Factory.json");

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

module.exports = async function (hre) {

  const { ethers,getChainId,deployments, getNamedAccounts } = hre

  const { deploy } = deployments;

  const namedAccounts = await getNamedAccounts();
  const {deployer, dev} = namedAccounts;

  const UniswapV2Factory  = await deploy("UniswapV2Factory", {
    from: deployer,
    args: [dev],
    log: true,
    deterministicDeployment: false,
  });
  console.log('uniswapV2Factory deployed:',UniswapV2Factory.address)
  await sleep(60)
  console.log('verify the uniswap v2 factory:')
  await hre.run('verify:verify', {
    address: UniswapV2Factory.address,
    contract: 'contracts/uniswapv2/UniswapV2Factory.sol:UniswapV2Factory',
    constructorArguments: [dev],
  })

};

module.exports.tags = ["UniswapV2Factory", "AMM"];
