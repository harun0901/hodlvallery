interface FieldInfoProps {
  title: string;
  value: string;
  percent?: number;
}

const FieldInfo: React.FC<FieldInfoProps> = ({
                                               title,
                                               value,
                                               percent}) => (
  <div className={'flex flex-col justify-center w-full h-110px rounded-55 bg-white border-3 border-gray-260 px-34px py-18px'}>
    <p className={'font-medium text-sm text-gray-150 uppercase'}>{title}</p>
    <div className={'flex items-end mt-3px'}>
      <p className={'font-medium text-26px text-gray-400 leading-8'}>{value}</p>
      {percent &&
        <p className={`font-medium text-sm leading-6 pl-11px tracking-normal ${percent > 0 ? 'text-green-200' : 'text-red-400'}`}>{percent.toFixed(2)}%</p>
      }
    </div>
  </div>
)

export default FieldInfo
