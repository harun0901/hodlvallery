import {Button, FormDetailsConfigModel, Modal} from "../../components"

import styles from './farmDetails.module.scss'
import {useEffect, useState} from "react";
import useFarm from "../../state/farm/hooks";
import {FarmModel} from "../../types/FarmModel";
import Input from "./Input";

const farmConfig: FormDetailsConfigModel = {
  title: 'FARM DETAILS',
  infoColumns: [
    {title: 'Harvesting', value: '0'},
    {title: 'Harvesting', value: '0'},
    {title: 'BASE', value: 'ETH'},
    {title: 'QUOTE', value: 'DAI'}
  ]
}

const FarmDetailsModal: React.FC = () => {
  const { getCurrentFarm } = useFarm();
  const [farmData, setFarmData] = useState<FarmModel>();

  const [balanceAmount, setBalanceAmount] = useState('0');
  const [farmingAmount, setFarmingAmount] = useState('0');

  useEffect(() => {
    setFarmData(getCurrentFarm());
  }, [getCurrentFarm])

  return (
    <Modal isOpen={true}
           title={{firstLine: `farm`, secondLine: 'details'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           formDetailsConfig={farmConfig}
           mainIconName={"FarmOne"}>
      <div className={`h-full relative`}>
        <div className={`h-full flex flex-col`}>
          <div className={`w-full bg-gray-200 border-b-10 border-gray-100 p-10px relative p-20px rounded-tr-60 ${styles.assetForm}`}>
            {farmData &&
              <div className={'flex'}>
                <div className={styles.leftColumn}>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>TVL</p>
                    <p className={styles.value}>${farmData.tvl}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Rewards</p>
                    <p className={styles.value}>{farmData.rewards} {farmData.rewardToken.symbol}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Staked</p>
                    <p className={styles.value}>{farmData.staked} {farmData.stakeToken.symbol}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Apr</p>
                    <p className={styles.value}>{farmData.apr}%</p>
                  </div>
                </div>
                <div className={styles.rightColumn}>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Farm</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.value}>{farmData.rewardToken.symbol} / {farmData.stakeToken.symbol}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Harvesting</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={`font-medium text-xl uppercase tracking-normal ${farmData.harvesting ? 'text-green-400' : 'text-red-400'}`}>{farmData.harvesting ? 'YES' : 'NO'}</p>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className={`w-full relative z-10 ${styles.receiveForm}`}>
            {farmData &&
              <>
                <div className={'flex justify-between items-start'}>
                  <Input title={`BALANCE   23,342.25 ${farmData.rewardToken.symbol}`} value={balanceAmount} onChange={setBalanceAmount} />
                  <Input title={`FARMING   0 ${farmData.rewardToken.symbol}`} value={farmingAmount} onChange={setFarmingAmount} />
                </div>
                <div className={'flex justify-between items-center mt-35px'}>
                  <Button disabled={true}>
                    <p className={'tracking-normal text-gray-750'}>Farm</p>
                  </Button>
                  <Button disabled={true}>
                    <p className={'tracking-normal text-gray-750'}>Unfarm</p>
                  </Button>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FarmDetailsModal;
