import React, {useMemo} from "react";
import {directions} from "../../types/Directions";
import {formatNumber} from "../../functions";

export const getText = (text: string) => {
	return (
		<p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{text}</p>
	);
};

export const getDigit = (val: number, preffix = '') => {
	return (
		<p className={'font-medium text-sm text-gray-400 text-opacity-80'}>{preffix}{formatNumber(val)}</p>
	);
};

export const getColoredDigit = (val: number, suffix= '') => {
	return (
		<p className={`font-medium text-sm text-gray-400 text-opacity-80 ${val > 0 ? 'text-green-360' : 'text-red-400'}`}>{formatNumber(val)}{suffix}</p>
	);
};

export const TOKEN_COLUMNS = [
	{
		Header: "Name",
		headerProps: {
			alignment: directions.left
		},
		accessor: "name",
		Cell: function CellRender({ row, data }) {
			return getText(`${data[row.index].name} / ${data[row.index].symbol}`);
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
	return TOKEN_COLUMNS;
}, []);