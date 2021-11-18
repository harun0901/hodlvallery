const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000))

module.exports = async function (hre) {

  const { ethers,getChainId,deployments, getNamedAccounts } = hre

  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const moneyToken  = await deploy("MoneyToken", {
    from: deployer,
    log: true,
    deterministicDeployment: false
  })

  console.log('moneyToken deployed:',moneyToken.address)
  // await sleep(60)
  // console.log('verify the moneyToken factory:')
  // await hre.run('verify:verify', {
  //   address: moneyToken.address,
  //   contract: 'contracts/MoneyToken.sol:MoneyToken',
  // })

}

module.exports.tags = ["MoneyToken"]

