import React, {useMemo} from "react";
import {directions} from "../../../types/Directions";
import {formatNumber} from "../../../functions";
import Link from "next/link";

export const getText = (text: string) => {
	return (
		<p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{text}</p>
	);
};

export const getDigit = (val: number, prefix = '', suffix = '') => {
	return (
		<p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{prefix}{formatNumber(val)}{suffix}</p>
	);
};

export const getColoredDigit = (val: number, suffix= '') => {
	return (
		<p className={`font-medium text-sm text-gray-400 text-opacity-80 ${val > 0 ? 'text-green-360' : 'text-red-400'}`}>{formatNumber(val)}{suffix}</p>
	);
};

export const PROVIDER_COLUMNS = [
	{
		Header: "Liquidity Provider",
		headerProps: {
			alignment: directions.left
		},
		accessor: "preffix",
		width: 300,
		Cell: function CellRender({ row, data, value,  }) {
			return (
				<div className={'flex items-center'}>
					<div className={'bg-blue-300 px-10px py-4px rounded-full'}>
						<p className={'font-medium text-sm tracking-normal text-white'}>{value}</p>
					</div>
					<p className={'font-medium text-sm tracking-normal text-blue-300 pl-10px'}>{data[row.index].address}</p>
				</div>
			)
		},
		cellProps: {
			alignment: directions.left
		}
	},
	{
		Header: "Pool Share",
		headerProps: {
			alignment: directions.left
		},
		sortable: true,
		accessor: "poolShare",
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value }) {
			return getDigit(value, '', '%');
		}
	},
	{
		Header: "Liquidity Tokens Staked",
		headerProps: {
			alignment: directions.left
		},
		accessor: "liquidityTokensStaked",
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value }) {
			return getDigit(value, '', ' SLP');
		}
	},
	{
		Header: "Liquidity Tokens Staked USD",
		headerProps: {
			alignment: directions.left
		},
		accessor: "liquidityTokensStakedUSD",
		Cell: function CellRender({ value }) {
			return getDigit(value, '$', '');
		},
		cellProps: {
			alignment: directions.left
		}
	}
];

export const POOL_COLUMNS = [
	{
		Header: "Name",
		headerProps: {
			alignment: directions.left
		},
		accessor: "name",
		Cell: function CellRender({ row, data }) {
			return <Link href={`/pools/${data[row.index].id}`}>
				<a>{getText(`${data[row.index].baseSymbol} / ${data[row.index].quoteSymbol}`)}</a>
			</Link>
		},
		cellProps: {
			alignment: directions.left
		}
	},
	// {
	// 	Header: "Volume (24)",
	// 	headerProps: {
	// 		alignment: directions.left
	// 	},
	// 	accessor: "volume24h",
	// 	cellProps: {
	// 		alignment: directions.left
	// 	},
	// 	Cell: function CellRender({ value }) {
	// 		return getDigit(value, '$');
	// 	}
	// },
	{
		Header: "Reward (24H)",
		headerProps: {
			alignment: directions.left
		},
		accessor: "rewards",
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value }) {
			return getDigit(value, '', ' $HOLD');
		}
	},
	{
		Header: "ROI%",
		headerProps: {
			alignment: directions.left
		},
		accessor: "ROI",
		Cell: function CellRender({ value }) {
			return getColoredDigit(value, '%');
		},
		cellProps: {
			alignment: directions.left
		}
	},
	{
		Header: "Base Supply",
		headerProps: {
			alignment: directions.left
		},
		accessor: "baseSupply",
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value, row, data }) {
			return getDigit(value, '', data[row.index].baseSymbol);
		}
	},
	{
		Header: "Quote Supply",
		headerProps: {
			alignment: directions.left
		},
		accessor: "quoteSupply",
		Cell: function CellRender({ value, row, data }) {
			return getDigit(value, '', data[row.index].quoteSymbol);
		},
		cellProps: {
			alignment: directions.left
		}
	},
	{
		Header: "Total Value Locked",
		headerProps: {
			alignment: directions.left
		},
		accessor: "totalLocked",
		cellProps: {
			alignment: directions.left
		},
		Cell: function CellRender({ value }) {
			return getDigit(value, '$');
		}
	}
];
