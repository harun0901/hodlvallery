import React from "react";

import Select from "react-select";

import DropdownContainer from "./DropdownContainer";

export interface DropdownContainerProps {
  children: React.ReactNode;
}

export interface IDropdownItem {
  label: string;
  value: string;
}

interface SharedSelectProps {
  menuPosition?: string;
  placeholder?: string;
}

interface SelectProps {
  value: IDropdownItem;
  options: IDropdownItem[];
  onChange: (e: IDropdownItem) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  menuIsOpen?: boolean;
  menuPortalTarget?: HTMLElement;
}

export interface DropdownProps extends Omit<DropdownContainerProps, "children">, SharedSelectProps, SelectProps {
  autosize?: boolean;
  searchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
                           placeholder,
                           value,
                           options,
                           onChange,
                           searchable = false,
                           ...rest
                         }): JSX.Element => {
  const handleChange = React.useCallback(
    e => {
      onChange(e);
    },
    [onChange]
  );

  return (
    <div className={'custom-dropdown'}>
      <Select
        isSearchable={searchable}
        className="dropdown"
        classNamePrefix="dropdown"
        options={options}
        value={value || null}
        onChange={option => handleChange(option)}
        placeholder={placeholder ? placeholder : ""}
        // menuIsOpen={true}
        {...rest}
      />
    </div>
  );
};

export default Dropdown;
