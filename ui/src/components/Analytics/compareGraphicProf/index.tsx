import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./compareGraphicProf.module.scss";
import {useCallback} from "react";
import {DateTime} from "luxon";
import Image from "next/image";

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
      thirdValue: getRandomInt(10, 70)
    });
  }
}

interface CompareGraphicDataModel {
  color: string;
  text: string;
}

interface CompareGraphicProfProps {
  title: string;
  dataConfig: CompareGraphicDataModel[];
  allowConvert?: boolean;
}

const CompareGraphicProf: React.FC<CompareGraphicProfProps> = ({title, dataConfig, allowConvert = false}) => {
  const formatXAxis = useCallback((tickItem: Date) => {
    const luxonDate = DateTime.fromISO(tickItem);
    return luxonDate && luxonDate.get('day') === 1 ? luxonDate.toFormat('LLL') : ''
  }, []);

  return (
    <div className={`${styles.wrapper} w-full h-full bg-gray-200 border-10 border-white rounded-52`}>
      <div className={'flex items-center'}>
        <p className={'font-bold text-base text-gray-400 uppercase leading-8'}>{title}</p>
        <div className={'ml-9px mt-4px'}>
          <Image src={'/icons/helpQuestion.svg'} alt="Help" width={23} height={23} />
        </div>
      </div>
      <div className={`flex items-center mt-15px pl-1px ${allowConvert ? 'justify-between' : 'justify-start'}`}>
        <div className={'flex items-center justify-start'}>
          {dataConfig.map((item, index) => (
            <div className={'flex items-center mr-21px last:mr-0'} key={index}>
              <div className={'w-10px h-10px rounded-full'} style={{backgroundColor: item.color}}></div>
              <p className={'font-medium text-sm text-gray-150 tracking-normal pl-10px'}>{item.text}</p>
            </div>
          ))}
        </div>
        {allowConvert &&
          <div className={'flex items-center justify-end'}>
            <p className={'font-medium text-sm tracking-normal uppercase cursor-pointer text-blue-400 mr-10px'}>WBTC</p>
            <p className={'font-medium text-sm tracking-normal uppercase cursor-pointer text-gray-150'}>USD</p>
          </div>
        }
      </div>
      <hr className={'w-full h-5px bg-gray-800 bg-opacity-20 border-0 mt-16px rounded'} />
      <ResponsiveContainer width="100%" height={250} className={'mt-31px'}>
        <LineChart height={250} data={data}>
          <CartesianGrid strokeDasharray="0" vertical={false} />
          <Line dataKey="firstValue" stroke="#0062ff" strokeWidth={2} dot={{r: 0}} />
          <Line dataKey="secondValue" stroke="#FF3434" strokeWidth={2} dot={{r: 0}} />
          <Line dataKey="thirdValue" stroke="#40B700" strokeWidth={2} dot={{r: 0}} />
          <XAxis dataKey="date" tickFormatter={formatXAxis} tickCount={5} interval={1} axisLine={false} />
          <YAxis dataKey="firstValue" tickCount={5} interval={0} axisLine={false} tickSize={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CompareGraphicProf
