import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import styles from "./compareGraphic.module.scss";
import {useCallback, useState} from "react";
import {DateTime} from "luxon";


interface CompareGraphicProps {
  rawData: Array<any>;
  firstData: {
    color: string;
    text: string;
  },
  secondData?: {
    color: string;
    text: string;
  }
}

const CompareGraphic: React.FC<CompareGraphicProps> = ({rawData,firstData, secondData}) => {
  const formatXAxis = useCallback((tickItem: Date) => {
    const luxonDate = DateTime.fromJSDate(tickItem);
    return luxonDate && luxonDate.get('day') === 1 ? luxonDate.toFormat('LLL') : ''
  }, []);

  const [filteredData, setFilteredData] = useState(
      rawData.map((curve) => {
        return curve.slice(curve.length - 30, curve.length - 1)
      })
  );
  const slpAge = filteredData[0]
  const slpAgeRemoved = filteredData[1]

  const data = slpAge.map((datum0: any, index: number)=>{
    return {
      date: new Date(datum0.date),
      value0: datum0.value,
      value1: secondData?  slpAgeRemoved[index].value: undefined,
    }
  });


  return (
    <div className={`${styles.wrapper} w-full bg-gray-200 border-10 border-white rounded-60 py-30px pr-38px pl-19px`}>
      <div className={'flex items-center justify-center mb-46px'}>
        <div className={'flex items-center'}>
          <div className={'w-10px h-10px rounded-full'} style={{backgroundColor: firstData.color}}></div>
          <p className={'font-medium text-sm text-gray-150 tracking-normal pl-9px'}>{firstData.text}</p>
        </div>
        {secondData &&
          <div className={'flex items-center ml-56px'}>
            <div className={'w-10px h-10px rounded-full'} style={{backgroundColor: secondData.color}}></div>
            <p className={'font-medium text-sm text-gray-150 tracking-normal pl-9px'}>{secondData.text}</p>
          </div>
        }
      </div>
      <ResponsiveContainer width="100%" height={208}>
        <LineChart height={208} data={data}>
          <CartesianGrid strokeDasharray="0" vertical={false} />
          <Line type="monotone" dataKey="value0" stroke="#0062ff" strokeWidth={2} dot={{r: 0}} />
          <Line type="monotone" dataKey="value1" stroke="#f5a623" strokeWidth={2} dot={{r: 0}} />
          <XAxis dataKey="date" tickFormatter={formatXAxis} />
          <YAxis />
          {/*<YAxis dataKey="age" domain={[0, 0.4]} tickCount={1} interval={10} axisLine={false} tickSize={0} />*/}
        </LineChart>
      </ResponsiveContainer>
      <div className={`${styles.previewWrapper} bg-white border-3 border-gray-260 rounded-70 overflow-hidden`}>
        <ResponsiveContainer width="100%" height={58}>
          <LineChart height={58} data={data}>
            <Line type="monotone" dataKey="value0" stroke="#0062ff" strokeWidth={2} dot={{r: 0}} />
            <Line type="monotone" dataKey="value1" stroke="#f5a623" strokeWidth={2} dot={{r: 0}} />
            <YAxis />
            {/*<YAxis dataKey="age" domain={[5, 55]} axisLine={false} allowDataOverflow={true} tick={false} />*/}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CompareGraphic
