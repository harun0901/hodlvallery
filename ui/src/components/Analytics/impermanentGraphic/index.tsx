import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./impermanentGraphic.module.scss";
import {useCallback, useState} from "react";
import {DateTime} from "luxon";
import Image from "next/image";
import {Dropdown} from "../../../components"
import {IDropdownItem} from "../../../components/Dropdown";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const data = [];
const luxonDate = DateTime.fromJSDate(new Date('2021/04/01'));
for (let i = 1; i < 270; i++) {
  const newDate = luxonDate.plus({ days: i });
  if (newDate.get('day') % 5===0 || newDate.get('day') === 1) {
    data.push({
      date: luxonDate.plus({ days: i }).toISO(),
      firstValue: getRandomInt(20, 140),
      secondValue: getRandomInt(15, 60),
      thirdValue: getRandomInt(10, 70),
      fourthValue: getRandomInt(10, 70)
    });
  }
}

interface CompareGraphicDataModel {
  color: string;
  text: string;
}

const dataConfig: CompareGraphicDataModel[] = [
  {
    text: 'WBTC-ETH Pool ROI (USD)',
    color: '#FF3434'
  },
  {
    text: '12-Hour Average APY',
    color: '#0062FF'
  },
  {
    text: '12-Hour Average APY',
    color: '#40B700'
  },
  {
    text: 'WBTC-ETH Pool ROI (USD)',
    color: '#F5A623'
  }
];

const legendData = [
  {title: 'Pool ROI', value: '+17.30%'},
  {title: 'HODL ROI (USD)', value: '+17.46%'},
  {title: 'Impermanent Gain/Loss', value: '-0.13%'},
  {title: 'Pool Net Gain', value: '+0.17 USD'},
  {title: 'WBTC-ETH HODL Net Gain', value: '+0.17 USD'},
  {title: 'Pool vs HODL Net Gain', value: '-0.001573 USD'},
]

const configTypeList: IDropdownItem[] = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' }
];

const configAmountList: IDropdownItem[] = [
  { label: '00', value: '00' },
  { label: '100', value: '100' },
  { label: '200', value: '200' }
];

const configHodlTypeList: IDropdownItem[] = [
  { label: 'WBTC-RTH (50%-50%)', value: '0' },
  { label: 'WBTC-RTH (0%-50%)', value: '1' },
  { label: 'WBTC-RTH (50%-100%)', value: '2' },
  { label: 'WBTC-RTH (0%-100%)', value: '3' },
];

const configReturnTypeList: IDropdownItem[] = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' }
];

interface ImpermanentGraphicProps {
}

const ImpermanentGraphic: React.FC<ImpermanentGraphicProps> = () => {
  const [configType, setConfigType] = useState<IDropdownItem>(configTypeList[0]);
  const [configAmount, setConfigAmount] = useState<IDropdownItem>(configTypeList[0]);
  const [configHodlType, setConfigHodlType] = useState<IDropdownItem>(configHodlTypeList[0]);
  const [configReturnType, setConfigReturnType] = useState<IDropdownItem>(configReturnTypeList[0]);

  const formatXAxis = useCallback((tickItem: Date) => {
    const luxonDate = DateTime.fromISO(tickItem);
    return luxonDate && luxonDate.get('day') === 1 ? luxonDate.toFormat('LLL') : ''
  }, []);

  return (
    <div className={`${styles.wrapper} w-full bg-gray-200 border-10 border-white rounded-52`}>
      <div className={'flex items-center'}>
        <p className={'font-bold text-base text-gray-400 uppercase leading-8'}>Impermanent Loss/ROI Calculator</p>
        <div className={'ml-9px mt-4px'}>
          <Image src={'/icons/helpQuestion.svg'} alt="Help" width={23} height={23} />
        </div>
      </div>
      <div className={`w-full h-70px rounded-full bg-white border-3 border-gray-260 flex items-start justify-start mt-17px ${styles.infoTable}`}>
        <div className={'flex flex-col justify-center items-start border-r-3 border-gray-260 px-20px h-full'}>
          <p className={'font-medium text-sm text-gray-150 uppercase'}>Type</p>
          <div className={'w-80px'}>
            <Dropdown options={configTypeList} value={configType} onChange={setConfigType} />
          </div>
        </div>
        <div className={'flex flex-col justify-center items-start border-r-3 border-gray-260 px-20px h-full'}>
          <p className={'font-medium text-sm text-gray-150 uppercase'}>Amount</p>
          <div className={'w-80px'}>
            <Dropdown options={configAmountList} value={configAmount} onChange={setConfigAmount} />
          </div>
        </div>
        <div className={'flex flex-col justify-center items-start border-r-3 border-gray-260 px-20px h-full'}>
          <p className={'font-medium text-sm text-gray-150 uppercase'}>From</p>
          <p className={'font-medium text-base text-gray-400'}>May 27, 2021 16:47</p>
        </div>
        <div className={'flex flex-col justify-center items-start border-r-3 border-gray-260 px-20px h-full'}>
          <p className={'font-medium text-sm text-gray-150 uppercase'}>To</p>
          <p className={'font-medium text-base text-gray-400'}>May 27, 2021 16:47</p>
        </div>
        <div className={'flex flex-col justify-center items-start border-r-3 border-gray-260 px-20px h-full'}>
          <p className={'font-medium text-sm text-gray-150 uppercase'}>HODL TYPE</p>
          <div className={styles.hodlTypeDropdownWrapper}>
            <Dropdown options={configHodlTypeList} value={configHodlType} onChange={setConfigHodlType} />
          </div>
        </div>
        <div className={'flex flex-col justify-center items-start px-20px h-full'}>
          <p className={'font-medium text-sm text-gray-150 uppercase'}>Return TYPE</p>
          <div className={'w-100px'}>
            <Dropdown options={configReturnTypeList} value={configReturnType} onChange={setConfigReturnType} />
          </div>
        </div>
      </div>
      <div className={`flex items-center mt-27px pl-7px`}>
        <div className={'flex items-center justify-start'}>
          {dataConfig.map((item, index) => (
            <div className={'flex items-center mr-21px last:mr-0'} key={index}>
              <div className={'w-10px h-10px rounded-full'} style={{backgroundColor: item.color}}></div>
              <p className={'font-medium text-sm text-gray-150 tracking-normal pl-10px'}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={295} className={'mt-38px'}>
        <LineChart height={295} data={data}>
          <CartesianGrid strokeDasharray="0" vertical={false} />
          <Line dataKey="firstValue" stroke="#0062ff" strokeWidth={2} dot={{r: 0}} />
          <Line dataKey="secondValue" stroke="#FF3434" strokeWidth={2} dot={{r: 0}} />
          <Line dataKey="thirdValue" stroke="#40B700" strokeWidth={2} dot={{r: 0}} />
          <Line dataKey="fourthValue" stroke="#F5A623" strokeWidth={2} dot={{r: 0}} />
          <XAxis dataKey="date" tickFormatter={formatXAxis} tickCount={5} interval={0} axisLine={false} />
          <YAxis dataKey="firstValue" tickCount={5} interval={0} axisLine={false} tickSize={0} />
        </LineChart>
      </ResponsiveContainer>
      <div className={'flex items-start justify-between mt-1px pr-38px'}>
        {legendData.map((item, index) => (
          <div className={'flex flex-col items-start justify-start'} key={index}>
            <p className={'font-medium text-base tracking-normal text-gray-150'}>{item.title}</p>
            <hr className={'w-full h-3px border-0 bg-gray-290 mt-1px mb-5px'} />
            <p className={'font-medium text-2xl text-gray-400 pl-5px'}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImpermanentGraphic
