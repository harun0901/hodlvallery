import React, {useMemo} from "react";
import styles from '../../../pages/tokens/tokens.module.scss';
import Image from "next/image";
import { decimalFormatter } from "../../../analytics/core/format";
import Link from "next/link";
import {formatNumber} from "../../../functions";
import {directions} from "../../../types/Directions";

export const getText = (text: string) => {
  return (
    <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{text}</p>
  );
};

export const getDigit = (val: number, preffix = '', suffix = '') => {
  return (
    <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{preffix}{formatNumber(val)}{suffix}</p>
);
};

export const getColoredDigit = (val: number, suffix= '') => {
  return (
    <p className={`font-medium text-sm text-gray-400 text-opacity-80 ${val > 0 ? 'text-green-360' : 'text-red-400'}`}>{formatNumber(val)}{suffix}</p>
);
};


export const INFORMATION_COLUMNS = [
  {
    Header: "Name",
    headerProps: {
      alignment: directions.left
    },
    accessor: "name",
    Cell: function CellRender({ value }) {
      // return getText(`${data[row.index].fromTokenSymbol} / ${data[row.index].toTokenSymbol}`);
      return getText(value);
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Symbol",
    headerProps: {
      alignment: directions.left
    },
    accessor: "symbol",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getText(value);
    }
  },
  {
    Header: "Address",
    headerProps: {
      alignment: directions.left
    },
    minWidth: 500,
    accessor: "address",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getText(value);
    }
  },
  {
    Header: "Etherscan",
    headerProps: {
      alignment: directions.left
    },
    accessor: "link",
    Cell: function CellRender({ value }) {
      return <p className={'font-medium text-base text-blue-400 tracking-normal uppercase cursor-pointer'}>VIEW</p>
    },
    cellProps: {
      alignment: directions.left
    }
  }
];

export const PAIR_COLUMNS = [
  {
    Header: "Name",
    headerProps: {
      alignment: directions.left
    },
    accessor: "name",
    width: 150,
    Cell: function CellRender({ row, data }) {
      return (
        <Link href={`/pairs/${data[row.index].id}`}>
      <a>
        <div className={'flex items-center'}>
      <div className={`${styles.tokenIconWrapper}`}>
      <Image src={data[row.index].firstToken.icon} alt={'Token'} width={19} height={19} />
      </div>
      <div className={`${styles.tokenIconWrapper} -ml-10px`}>
      <Image src={data[row.index].secondToken.icon} alt={'Token'} width={19} height={19} />
      </div>
      <p className={'pl-10px text-sm font-medium text-blue-300 tracking-normal'}>{data[row.index].firstToken.symbol}-{data[row.index].secondToken.symbol}</p>
        </div>
        </a>
        </Link>
    )
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Liquidity",
    sortable: true,
    headerProps: {
      alignment: directions.left
    },
    accessor: "liquidity",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    }
  },
  {
    Header: "Volume(24h)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "volume24h",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    }
  },
  {
    Header: "Volume(7d)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "volume7d",
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Fees(24h)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "fees24h",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    }
  },
  {
    Header: "Fees(7h)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "fees7h",
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Fees(Yearly)",
    headerProps: {
      alignment: directions.right
    },
    accessor: "feesYearly",
    cellProps: {
      alignment: directions.right
    },
    Cell: function CellRender({ value }) {
      return getColoredDigit(value, '%');
    }
  }
];

export const TRANSACTION_COLUMNS = [
  {
    Header: "Type",
    headerProps: {
      alignment: directions.left
    },
    width: 130,
    accessor: "type",
    Cell: function CellRender({ row: r, data, value }) {
      const row = data[r.index]
      return <>
        {row.__typename}{" "}
      {row.amount0In === "0" || row.__typename === 'Mint' && !row.amount0In
        ? row.pair.token1.symbol
        : row.pair.token0.symbol}{" "}
      for{" "}
      {row.amount1Out === "0" || row.__typename === 'Mint' && !row.amount1Out
        ? row.pair.token0.symbol
        : row.pair.token1.symbol}
      </>;
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Value",
    headerProps: {
      alignment: directions.left
    },
    maxWidth: 80,
    accessor: "value",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    }
  },
  {
    Header: "In",
    headerProps: {
      alignment: directions.left
    },
    maxWidth: 80,
    accessor: "in",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ row: r, data, value }) {
      const row = data[r.index]
      return  <>{decimalFormatter.format(row.amount0)}{" "}
      {row.amount1In === "0" || !row.amount1In
        ? row.pair.token0.symbol
        : row.pair.token1.symbol}</>
    }
  },
  {
    Header: "Out",
    maxWidth: 80,
    headerProps: {
      alignment: directions.left
    },
    accessor: "out",
    Cell: function CellRender({ row: r, data, value }) {
      const row = data[r.index]
      return <>
        {decimalFormatter.format(row.amount1)}{" "}
      {row.amount0Out === "0" || !row.amount0Out
        ? row.pair.token1.symbol
        : row.pair.token0.symbol}
      </>
      // return getDigit(value, '', ` ${data[row.index].toToken.symbol}`);
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "To",
    headerProps: {
      alignment: directions.left
    },
    accessor: "hash",
    width: 350,
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getText(value);
    }
  },
  {
    Header: "Time",
    headerProps: {
      alignment: directions.right
    },
    width: 120,
    accessor: "timestamp",
    Cell: function CellRender({ value }) {
      return getText(value);
    },
    cellProps: {
      alignment: directions.right
    }
  }
];

export const TOKEN_COLUMNS = [
  {
    Header: "Name",
    headerProps: {
      alignment: directions.left
    },
    accessor: "name",
    Cell: function CellRender({ row, data }) {
      return <Link href={`/tokens/${data[row.index].id}`}>
        <a>{getText(`${data[row.index].name}`)}</a>
      </Link>
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Liquidity",
    headerProps: {
      alignment: directions.left
    },
    accessor: "liquidity",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    }
  },
  {
    Header: "Volume (24)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "volume24h",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    }
  },
  {
    Header: "Price",
    headerProps: {
      alignment: directions.left
    },
    accessor: "price",
    Cell: function CellRender({ value }) {
      return getDigit(value, '$');
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Change (24H)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "change24h",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return getColoredDigit(value, '%');
    }
  },
  {
    Header: "Change (7D)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "change7d",
    Cell: function CellRender({ value }) {
      return getColoredDigit(value, '%');
    },
    cellProps: {
      alignment: directions.left
    }
  },
  {
    Header: "Chart (7D)",
    headerProps: {
      alignment: directions.left
    },
    accessor: "chart",
    cellProps: {
      alignment: directions.left
    },
    Cell: function CellRender({ value }) {
      return "-";
    }
  }
];

// eslint-disable-next-line import/no-anonymous-default-export
export default () => useMemo(() => {
  return TRANSACTION_COLUMNS;
}, []);
