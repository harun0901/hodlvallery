import React, {useCallback, useMemo, useState} from "react";

import Select from "react-select";

const options = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: 'All', value: 'all' },
]

interface PaginationProps {
  defaultPageSize?: number | 'all';
  totalCount: number;
  onChangePageSize: (pageSize: number | 'all') => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
                                        onChangePageSize,
                                        defaultPageSize = 10,
                                        totalCount,
                                        currentPage
                                      }): JSX.Element => {
  const [pageSize, setPageSize] = useState(options.find(x => x.value === defaultPageSize) || options[0]);

  const handleChange = React.useCallback(
    e => {
      setPageSize(e);
      onChangePageSize(e.value);
    },
    [onChangePageSize]
  );

  const handleOptionSelected = useCallback((option) => {
    return option.value === pageSize.value;
  }, [pageSize]);

  const currentPeriod = useMemo(() => {
    const correctPageSize = Number(pageSize.value) || totalCount;
    return `${currentPage * correctPageSize + 1}-${currentPage * correctPageSize + correctPageSize} of ${totalCount}`
  }, [pageSize, totalCount, currentPage])

  return (
    <div className={'flex items-center justify-end mt-10px'}>
      <p className={'font-bold font-sm text-gray-400 tracking-normal uppercase'}>Rows per page</p>
      <div className={'pagination-list-dropdown'}>
        <Select
          menuPlacement="top"
          className="dropdown"
          classNamePrefix="dropdown"
          options={options}
          isOptionSelected={(option) => handleOptionSelected(option)}
          value={pageSize}
          onChange={handleChange}
          isSearchable={false}
          // menuIsOpen={menuIsOpen}
          // onMenuOpen={onMenuOpen}
          // onMenuClose={onMenuClose}
        />
      </div>
      <p className={'font-bold font-sm text-gray-400 tracking-normal uppercase pl-50px'}>{currentPeriod}</p>
    </div>
  );
};

export default Pagination;
