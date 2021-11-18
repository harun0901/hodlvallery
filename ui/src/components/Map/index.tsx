import styles from './map.module.scss'
import Image from 'next/image'

const Map: React.FC = () => (
  <div className='flex relative justify-end'>
    <div className='flex flex-col justify-between mr-26px py-5px'>
      <div className={`flex justify-center items-center bg-gray-200 overflow-hidden border-4 border-white text-black cursor-pointer ${styles.btn}`}>
        <Image src={'/icons/plus.svg'} alt="Plus" width={16} height={16} />
      </div>
      <div className={`flex justify-center items-center bg-gray-200 overflow-hidden border-4 border-white text-black cursor-pointer ${styles.btn}`}>
        <Image src={'/icons/minus.svg'} alt="Minus" width={16} height={4} />
      </div>
    </div>
    <div className={`bg-transparent border-4 border-white opacity-50 bg-white bg-opacity-10 bg-valley-pattern bg-cover bg-no-repeat bg-center ${styles.wrapper}`}></div>
  </div>
)

export default Map
