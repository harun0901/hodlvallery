import {useState} from "react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

import { currencyFormatter} from "../../analytics/core/format";
import { oneMonth } from "../../analytics/core/timestamps";
import {oneWeek } from "../../analytics/core/timestamps";
import { timeFormat } from "d3-time-format";

interface PeriodModel {
  label: string;
  value: string;
}

const periodList: PeriodModel[] = [
  { label: '1w', value: '1W' },
  { label: '1m', value: '1M' },
  { label: 'All', value: 'ALL' },
]
interface VolumeGraphicProps {
  data: Array<any>
}
const VolumeGraphic: React.FC<VolumeGraphicProps> = ({data}) => {
  const [timespan, setTimespan] = useState(oneMonth());

  const formatDate = timeFormat("%b %d, '%y");
  const setGraphRange = (data) => {
    return  data.filter((d) => timespan <= d.date);
  }
  function onTimespanChange(value) {
    if (value === "ALL") {
      setTimespan(62802180);
    } else if (value === "1W") {
      setTimespan(oneWeek());
    } else if (value === "1M") {
      setTimespan(oneMonth());
    }
  }
  const [period, setPeriod] = useState<string>(periodList[1].value);

  if (data?.length > 1) {
    return (
        <div className={'w-full h-full rounded-55 bg-gray-200 border-10 border-white relative overflow-hidden'}>
          <div className={'w-full pt-25px pl-28px pr-10px'}>
            <p className={'font-bold text-base text-gray-400 uppercase'}>Volume</p>
            <div className={'flex justify-between items-start mt-8px'}>
              <div className={'flex flex-col'}>
                <p className={'font-medium text-35px text-gray-400 tracking-normal leading-10'}>{currencyFormatter.format(data[data.length - 1]?.value)}</p>
                <p className={'font-bold text-base text-gray-150 leading-4 -mt-2px'}>{formatDate(data[data.length - 1]?.date * 1e3)}</p>
              </div>
              <div className={'flex items-center pt-10px'}>
                {periodList.map((item, index) => (
                    <div className={`px-15px py-3px rounded-full cursor-pointer ${item.value === period ? 'bg-blue-400' : 'bg-transparent'}`}
                         key={index}
                         onClick={() => {
                           setPeriod(item.value)
                           onTimespanChange(item.value);
                         }}>
                      <p className={`font-bold text-base uppercase ${item.value === period ? 'text-white' : 'text-gray-150'}`}>{item.label}</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
          <div className={'absolute -bottom-5px left-0 w-full'}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={setGraphRange(data)} barGap={0} barCategoryGap={0}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="1%" stopColor="#3E88FF" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0241A5" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="uv" fillOpacity={1} fill="url(#colorPv)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    )
  }
  return <h1>Loading...</h1>
}

export default VolumeGraphic
