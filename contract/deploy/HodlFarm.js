const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

module.exports = async function (hre) {

  const { ethers,getChainId,deployments, getNamedAccounts } = hre

  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const moneyToken = await ethers.getContract("MoneyToken")

  const moneyHolder = "0x2d97A45D32669bC5a043eC8D33C40fF7858D3607";
  
  console.log(moneyToken.address,dev)
  
  const { address } = await deploy("HodlFarm", {
    from: deployer,
    args: [moneyToken.address, dev, moneyHolder , "0"],
    log: true,
    deterministicDeployment: false
  })


  await sleep(60)
  console.log('verify the HodlFarm factory:')
  await hre.run('verify:verify', {
    address: address,
    contract: 'contracts/HodlFarm.sol:HodlFarm',
    constructorArguments: [moneyToken.address, dev, moneyHolder , "0"],
  })

}

module.exports.tags = ["HodlFarm"]
module.exports.dependencies = ["MoneyToken"]

