import React from "react";

import Select, { components } from "react-select";
import {TokenModel} from "../../types/TokenModel";
import Image from "next/image";

const SingleValue = ({ ...props }) => {
  return (
    <components.SingleValue {...props}>
      <div className={'flex items-center pl-9px'}>
        <Image src={props.data.icon} alt={props.data.symbol} width={26} height={26} />
        <p className={'uppercase pl-9px'}>{props.data.name}</p>
      </div>
    </components.SingleValue>
  );
};

const Option = props => {
  return (
    <components.Option {...props}>
      <div className={'flex items-center'}>
        <Image src={props.data.icon} alt={props.data.symbol} width={26} height={26} />
        <p className={'uppercase text-gray-400 pl-10px'}>{props.data.name}</p>
      </div>
    </components.Option>
  );
};

const { ValueContainer } = components;

const CustomValueContainer = ({ children, ...props }) => {
  const commonProps = {
    cx: props.cx,
    clearValue: props.clearValue,
    getStyles: props.getStyles,
    getValue: props.getValue,
    hasValue: props.hasValue,
    isMulti: props.isMulti,
    isRtl: props.isRtl,
    options: props.options,
    selectOption: props.selectOption,
    setValue: props.setValue,
    selectProps: props.selectProps,
    theme: props.theme
  };

  const value = props?.getValue()[0];

  return (
    <ValueContainer {...props}>
      {React.Children.map(children, child => {
        return child ? (
          child
        ) : props.hasValue ? (
          <SingleValue
            {...commonProps}
            isFocused={props.selectProps.isFocused}
            isDisabled={props.selectProps.isDisabled}
            data={value}
          />
        ) : (
          <components.Placeholder
            {...commonProps}
            key="placeholder"
            isDisabled={props.selectProps.isDisabled}
            data={props.getValue()}
          >
            <p>{props.selectProps.placeholder}</p>
          </components.Placeholder>
        );
      })}
    </ValueContainer>
  );
};

interface TokenListDropdownProps {
  placeholder?: string;
  value?: TokenModel;
  onChange: (val: TokenModel) => void;
  menuIsOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  options: TokenModel[];
}

const TokenListDropdown: React.FC<TokenListDropdownProps> = ({
                                        placeholder,
                                        value,
                                        onChange,
                                        menuIsOpen,
                                        onMenuOpen,
                                        onMenuClose,
                                        options,
                                        ...rest
                                      }): JSX.Element => {
  const handleChange = React.useCallback(
    e => {
      onChange(e);
    },
    [onChange]
  );

  const handleOptionSelected = (option, value) => {
    return value?.assetSymbol === option.assetSymbol && value?.quoteSymbol === option.quoteSymbol;
  };

  return (
    <div className={'token-list-dropdown'}>
      <Select
        className="dropdown"
        classNamePrefix="dropdown"
        options={options}
        isOptionSelected={(option, value) => handleOptionSelected(option, value)}
        value={value}
        onChange={values => handleChange(values)}
        placeholder={placeholder}
        components={{ SingleValue, Option, ValueContainer: CustomValueContainer }}
        isSearchable={false}
        menuIsOpen={menuIsOpen}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
      />
    </div>
  );
};

export default TokenListDropdown;
