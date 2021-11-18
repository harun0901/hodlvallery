import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";
import {useCallback} from "react";

const data = [
  {
    name: 1,
    pv: 2400,
  },
  {
    name: 2,
    pv: 1398,
  },
  {
    name: 3,
    pv: 9800,
  },
  {
    name: 4,
    pv: 3908,
  },
  {
    name: 5,
    pv: 4800,
  },
  {
    name: 6,
    pv: 3800,
  },
  {
    name: 7,
    pv: 4300,
  },
  {
    name: 8,
    pv: 2400,
  },
  {
    name: 9,
    pv: 1398,
  },
  {
    name: 10,
    pv: 9800,
  },
  {
    name: 11,
    pv: 3908,
  },
  {
    name: 12,
    pv: 4800,
  },
  {
    name: 13,
    pv: 3800,
  },
  {
    name: 14,
    pv: 4300,
  },
  {
    name: 15,
    pv: 3908,
  }
];

const CustomTick: React.FC = (props: any) => {
  const {
    x,
    y,
    payload
  } = props;

  const svg = document.createElement('svg');
  const text = document.createElement('text');
  text.innerText = payload.value;
  text.classList.add('text-11px', 'font-bold', 'text-gray-400');
  svg.appendChild(text);

  svg.style.opacity = '0';
  svg.style.overflow = 'hidden';
  svg.style.maxHeight = '0';
  svg.style.width = 'fit-content';
  document.body.appendChild(svg);
  const width = svg.clientWidth;
  document.body.removeChild(svg);

  return (
    <svg>
      <circle cx={x - 2} cy={y - 8} r="2" fill={'#21314A'} />
      <text x={x - width / 2 - 2} y={y + 12} className={'text-11px font-bold text-gray-400'}>{payload.value}</text>
    </svg>
  )
}


interface GraphicProps {
  data
}

const Graphic: React.FC<GraphicProps> = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height={170}>
      <LineChart width={300} height={100} data={data}>
        <Line type="monotone" dataKey="pv" stroke="#3E88FF" strokeWidth={4} dot={{r: 0}} />
        <XAxis dataKey="name" stroke={'transparent'} tick={<CustomTick />} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Graphic
