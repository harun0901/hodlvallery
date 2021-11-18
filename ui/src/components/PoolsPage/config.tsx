import React, {useMemo} from "react";
import {directions} from "../../types/Directions";
import {formatNumber} from "../../functions";

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

export const POOL_COLUMNS = [
	{
		Header: "Name",
		headerProps: {
			alignment: directions.left
		},
		accessor: "name",
		Cell: function CellRender({ row, data }) {
			return getText(`${data[row.index].quoteName} / ${data[row.index].quoteSymbol}`);
		},
		cellProps: {
			alignment: directions.left
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

// eslint-disable-next-line import/no-anonymous-default-export
export default () => useMemo(() => {
	return POOL_COLUMNS;
}, []);