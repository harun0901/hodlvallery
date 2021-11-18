import styles from "./home.module.scss"

const NetworkStatus: React.FC<{networkName?: string, network?: string}> = ({networkName = "Ethereum Mainnet", network = "mainnet"}) => (
  <div className='flex items-center'>
    <div className={`relative border-opacity-5 border-4 rounded-full ${network === "Mainnet" ? 'border-green-600' : 'border-red-500'} ${styles.ring1}`}>
      <div className={`absolute top-3px left-3px border-opacity-30 border-4 rounded-full ${network === "Mainnet" ? 'border-green-600' : 'border-red-500'} ${styles.ring2}`}>
        <div className={`absolute top-3px left-3px border-opacity-100 border-4 rounded-full ${network === "Mainnet" ? 'bg-green-300 border-green-600' : 'bg-red-400 border-red-500'} ${styles.ring3}`}>
        </div>
      </div>
    </div>
    <p className={'uppercase text-xl pl-4 tracking-normal pl-17px'}>
      {networkName}
    </p>
  </div>
);

export default NetworkStatus
