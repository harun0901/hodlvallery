import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";

import PerfectScrollbar from "react-perfect-scrollbar";
import {Column, useExpanded, useFlexLayout, useResizeColumns, useSortBy, useTable} from "react-table";

import {FixedSizeList} from "react-window";
import {directions} from "../../types/Directions";
import {usePrevious} from "../../hooks/usePrevious";

import Pagination from "./Pagination"

export enum tablePalettes {
	dark = "dark",
	light = "light"
}

export interface IHeaderProps {
	alignment?: directions;
	customStyle?: string;
}

export type ColumnType = Column & {
	expandable?: boolean;
	sortable?: boolean;
	headerProps?: IHeaderProps;
	align?: "left" | "center" | "right";
	cellProps?: IHeaderProps;
};

export interface PaginationModel {
	defaultPageSize?: number;
	totalCount: number;
	currentPage: number;
	onChangePageSize: (pageSize: number | 'all') => void;
}

export interface TableProps {
	columns: ColumnType[];
	data: any;
	noContentMessage?: string;
	sortable?: boolean;
	expandable?: boolean;
	className?: string;
	headerBordered?: boolean;
	onClickRow?: (index: number) => void;
	onScrollEnd?: () => void;
	onChangeExpanded?: (expanded: any) => void;
	virtualized?: boolean;
	rowHeight?: number;
	height?: number;
	loading?: boolean;
	paginationConfig?: PaginationModel;
}

const defaultProps = {
	noContentMessage: "There are currently no data to show",
	sortable: false,
	expandable: false,
	palette: tablePalettes.light
};

const BuildTable = ({
	columns,
	data,
	noContentMessage,
	sortable,
	headerBordered,
	onClickRow,
	onChangeExpanded,
	virtualized,
	rowHeight,
	height,
	onScrollEnd,
	loading,
	paginationConfig,
	...rest
}: TableProps): JSX.Element => {
	const listRef = React.createRef<any>();
	const [scrollEl, setScrollEl] = useState<any>();
	const [latestRow, setLatestRow] = useState(0);

	const headRef = React.useRef<any>(null);
	const bodyHeight = height || 600;
	const correctRowHeight = useMemo(() => rowHeight || 54, [rowHeight]);

	const prevLoading = usePrevious(loading);

	const defaultColumn = React.useMemo(
		() => ({
			width: 100,
			minWidth: 100,
			maxWidth: 200
		}),
		[]
	);

	const usePagination = useMemo(() => {
		return !!paginationConfig;
	}, [paginationConfig])

	const handleRowClick = React.useCallback(
		(index: number) => {
			if (onClickRow) {
				onClickRow(index);
			}
		},
		[onClickRow]
	);

	const handleExpandedChange = React.useCallback(
		(expanded: any) => {
			onChangeExpanded && onChangeExpanded(expanded);
		},
		[onChangeExpanded]
	);

	const handleScrollEnd = React.useCallback(() => {
		if (!!data?.length && !loading && onScrollEnd) {
			setLatestRow(usePagination ? 1 : data.length);
			onScrollEnd();
		}
	}, [data, onScrollEnd, loading, usePagination]);

	useEffect(() => {
		if (scrollEl?.clientHeight && ((loading && prevLoading) || (!loading && !prevLoading))) {
			scrollEl.scrollTop = (latestRow - 1) * correctRowHeight;

			if (listRef?.current?.scrollToItem) {
				listRef.current.scrollToItem(latestRow - 1);
			}
		}
	}, [loading, prevLoading, latestRow, scrollEl, listRef, correctRowHeight]);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		totalColumnsWidth,
		// @ts-ignore
		state: { expanded }
	} = useTable(
		{
			columns,
			data,
			defaultColumn
		},
		useSortBy,
		useExpanded,
		useResizeColumns,
		useFlexLayout
	);

	useEffect(() => {
		handleExpandedChange(expanded);
	}, [handleExpandedChange, expanded]);

	const getHeader = column => {
		let headerProps = column.getHeaderProps(column.headerProps ? column.headerProps : undefined);

		if (sortable) {
			headerProps = {
				...headerProps,
				...column.getHeaderProps(column.sortable ? column.getSortByToggleProps() : undefined)
			};

			return (
				<div className={`th headerTh ${headerProps?.alignment === directions.left ? 'left' : headerProps?.alignment === directions.right ? 'right' : 'center'}`} {...headerProps}>
					{column.render("Header")}
					{/* Add a sort direction indicator */}
					{/*<SortArrowWrapper>*/}
					{/*	{column.isSorted ? column.isSortedDesc ? <ArrowDownIcon /> : <ArrowUpIcon /> : ""}*/}
					{/*</SortArrowWrapper>*/}
				</div>
			);
		}

		return (
			<div className={`th headerTh ${headerProps?.alignment === directions.left ? 'left' : headerProps?.alignment === directions.right ? 'right' : 'center'}`} {...headerProps}>
				{column.render("Header")}
			</div>
		);
	};

	const getBody = (cell, i: number, columns, parentRow) => {
		const bodyProps = {
			...cell.getCellProps(),
			...columns[i].cellProps,
			expanded: cell.row.isExpanded || false,
			inner: cell.row.depth > 0,
			first: i === 0,
			lastInnerRow: parentRow ? parentRow.subRows.length - 1 === cell.row.index : undefined
		};


		return (
			<div className={`td bodyTd flex items-center 
											${bodyProps?.alignment === directions.left ? 'left' : bodyProps?.alignment === directions.right ? 'right' : 'center'}
											${(bodyProps.expanded || bodyProps.inner) && bodyProps?.first ? 'first' : ''}`} {...bodyProps}>
				{cell.render("Cell")}
			</div>
		);
	};

	const RenderRow = React.useCallback(
		({ index, style }) => {
			const row = rows[index];
			prepareRow(row);
			let parentRow: any = null;
			// @ts-ignore
			if (row?.depth) {
				const idInfo = row.id.split(".");
				if (idInfo.length >= 2) {
					const parentInfo = rows.find(x => x.id === idInfo[0]);
					if (parentInfo) {
						parentRow = parentInfo;
					}
				}
			}
			return (
				<div className="tr" {...row.getRowProps({ style })} key={index} onClick={() => handleRowClick(index)}>
					{row.cells.map((cell, key) => getBody(cell, key, columns, parentRow))}
				</div>
			);
		},
		[prepareRow, rows, handleRowClick, columns]
	);

	// eslint-disable-next-line react/display-name
	const PerfectScrollbarWrapper = useCallback(
		props => (
			<PerfectScrollbar
				{...props}
				containerRef={ref => {
					setScrollEl(ref);
				}}
				onYReachEnd={() => {
					setTimeout(() => {
						handleScrollEnd();
					}, 10);
				}}
			/>
		),
		[handleScrollEnd]
	);

	return (
		<div className={'tableWrapper'} {...rest}>
			<div className="tableWrap">
				<PerfectScrollbar
					options={{
						suppressScrollY: true
					}}
				>
					<div className="table" {...getTableProps()}>
						<div className="thead" ref={headRef}>
							{headerGroups.map((headerGroup, rowKey) => (
								<div
									className={`tr headerTr`}
									{...headerGroup.getHeaderGroupProps()}
									key={rowKey}
									// bordered={headerBordered}
								>
									{headerGroup.headers.map((column, columnKey) => getHeader(column))}
								</div>
							))}
						</div>
						{!!rows.length && (
							<div
								className="tbody"
								{...getTableBodyProps()}
								// virtualized={virtualized}
								style={{width: `${Math.max(totalColumnsWidth, headRef?.current?.clientWidth)}px` }}
								// width={Math.max(totalColumnsWidth, headRef?.current?.clientWidth)}
							>
								{!!loading &&
									<p className={'uppercase'}>LOADING</p>
								}
								{!virtualized && (
									<Fragment>
										{rows.map((row, i, arr) => {
											prepareRow(row);
											let parentRow: any = null;
											// @ts-ignore
											if (row?.depth) {
												const idInfo = row.id.split(".");
												if (idInfo.length >= 2) {
													const parentInfo = arr.find(x => x.id === idInfo[0]);
													if (parentInfo) {
														parentRow = parentInfo;
													}
												}
											}
											return (
												<div
													className="tr bodyTr"
													{...row.getRowProps()}
													key={i}
													onClick={() => handleRowClick(i)}
													style={correctRowHeight ? {height: `${correctRowHeight}px`} : {}}
													// rowHeight={correctRowHeight}
												>
													{row.cells.map((cell, key) => getBody(cell, key, columns, parentRow))}
												</div>
											);
										})}
									</Fragment>
								)}
								{virtualized && (
									<PerfectScrollbar>
										<FixedSizeList
											ref={listRef}
											outerElementType={PerfectScrollbarWrapper}
											height={rows.length * correctRowHeight < bodyHeight ? rows.length * correctRowHeight : bodyHeight}
											itemCount={rows.length}
											itemSize={correctRowHeight}
											width={"100%"}
										>
											{RenderRow}
										</FixedSizeList>
									</PerfectScrollbar>
								)}
							</div>
						)}
					</div>
				</PerfectScrollbar>
				{!rows.length && (
					<div className={'w-full text-center py-100px'}>
						<p className={'font-medium text-xl'}>{noContentMessage}</p>
					</div>
				)}
			</div>
		</div>
	);
};

const Table = ({ columns, data, noContentMessage, expandable, paginationConfig, sortable, ...rest }: TableProps): JSX.Element => {
	const noContent = noContentMessage || defaultProps.noContentMessage;
	const useSortable = sortable || defaultProps.sortable;
	const useExpandable = expandable || defaultProps.expandable;
	const useColumns = [...columns].map((item: ColumnType) => {
		if (item.expandable && useExpandable) {
			return {
				...item,
				id: "expander", // Make sure it has an ID
				Cell: function CellRender({ row, data, value }) {
					const originalCell = item["Cell"];
					let originalIndex = row.index;
					if (row.depth) {
						originalIndex = row.id.split(".")[0];
					}
					const useData = row.depth ? data[originalIndex].subRows : data;
					return row.canExpand ? (
						<span {...row.getToggleRowExpandedProps({})}>{originalCell({ row, data: useData, value })}</span>
					) : (
						<Fragment>{originalCell({ row, data: useData })}</Fragment>
					);
				}
			};
		} else if (item) {
			return {
				...item,
				Cell: function CellRender({ row, data, value }) {
					const originalCell = item["Cell"];
					let originalIndex = row.index;
					if (row.depth) {
						originalIndex = row.id.split(".")[0];
					}
					const useData = row.depth ? data[originalIndex].subRows : data;
					if (originalCell) {
						return <Fragment>{originalCell({ row, data: useData, value })}</Fragment>;
					}
					return <Fragment />;
				}
			};
		}

		return item;
	});

	return (
		<div className={'tableComponent'}>
			<BuildTable
				sortable={useSortable}
				columns={useColumns as ColumnType[]}
				data={data}
				noContentMessage={noContent}
				paginationConfig={paginationConfig}
				{...rest}
			/>
			{paginationConfig && <Pagination
				defaultPageSize={paginationConfig.defaultPageSize}
				totalCount={paginationConfig.totalCount}
				onChangePageSize={paginationConfig.onChangePageSize}
				currentPage={paginationConfig.currentPage} />
			}
		</div>
	);
};

export default Table;
