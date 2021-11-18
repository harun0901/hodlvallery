import React, {useMemo} from "react";
import {directions} from "../../../types/Directions";
import {formatNumber} from "../../../functions";
import Link from "next/link";
import { formatCurrency } from "../../../analytics/core/format";

export const getText = (text: string, preffix = '') => {
	return (
		<p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{preffix}{text}</p>
	);
};

export const getDigit = (val: number, preffix= '', suffix = '') => {
	return (
		<p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{preffix}{formatNumber(val)}{suffix}</p>
	);
};

export const COLUMNS = (isGainer) => [
	{
		Header: "Name",
		headerProps: {
			alignment: directions.left
		},
		accessor: "name",
		Cell: function CellRender({ value, data, row }) {
			return <Link href={`/pairs/${data[row.index].id}`}>
				<a className={'font-medium text-sm text-gray-400 text-opacity-80'}>{`${data[row.index].token0.symbol.replace(
					"WETH",
					"ETH"
				)}-${data[row.index].token1.symbol.replace("WETH", "ETH")}`}</a>
			</Link>;
		},
		cellProps: {
			alignment: directions.left
		}
	},
	{
		Header: isGainer ? "Fees USD Gained" : 'Fees USD Lost',
		headerProps: {
			alignment: directions.left
		},
		accessor: isGainer ? "feesUSDGained" : 'feesUSDLost',
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value, data, row }) {
			return  isGainer? <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>
				+{formatCurrency(data[row.index].feesUSDGained - data[row.index].feesUSDGainedYesterday)}
			</p>: <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>
				-{formatCurrency(data[row.index].feesUSDLost - data[row.index].feesUSDLostYesterday)}
			</p>
		}
	},
	{
		Header: isGainer ? "Volume USD Gained" : 'Volume USD Lost',
		headerProps: {
			alignment: directions.left
		},
		accessor: isGainer ? "volumeUSDGained" : 'volumeUSDLost',
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value, data,row }) {
			return  isGainer? <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>+{formatCurrency(data[row.index].volumeUSDGained)}</p>: <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>-{formatCurrency(data[row.index].volumeUSDLost)}</p>
		}
	},
	{
		Header: isGainer ? "Liquidity USD Gained" : 'Liquidity USD Lost',
		headerProps: {
			alignment: directions.left
		},
		accessor: isGainer ? "liquidityUSDGained" : 'liquidityUSDLost',
		Cell: function CellRender({ value, data, row }) {
			return  isGainer? <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>+{formatCurrency(data[row.index].reserveUSDGained)}</p>: <p className={'font-medium text-sm text-gray-400 text-opacity-80'}>-{formatCurrency(data[row.index].reserveUSDLost)}</p>
		},
		cellProps: {
			alignment: directions.left
		}
	},
	// {
	// 	Header: "Total SUSHI",
	// 	headerProps: {
	// 		alignment: directions.left
	// 	},
	// 	accessor: "totalSUSHI",
	// 	Cell: function CellRender({ value }) {
	// 		return getDigit(value);
	// 	},
	// 	cellProps: {
	// 		alignment: directions.left
	// 	}
	// },
	// {
	// 	Header: "Total ETH",
	// 	headerProps: {
	// 		alignment: directions.left
	// 	},
	// 	accessor: "totalETH",
	// 	Cell: function CellRender({ value }) {
	// 		return getDigit(value);
	// 	},
	// 	cellProps: {
	// 		alignment: directions.left
	// 	}
	// }
];

// eslint-disable-next-line import/no-anonymous-default-export
export default () => useMemo(() => {
	return COLUMNS;
}, []);
