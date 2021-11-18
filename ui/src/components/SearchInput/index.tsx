import {useCallback} from "react";
import styles from './searchInput.module.scss'
import Image from "next/image";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                   placeholder= 'SEARCH...',
                                                   value,
                                                   onChange
                                                 }) => {
  const handleChange = useCallback((e) => {
    onChange(e.target.value)
  }, [onChange]);

  return (
    <div className={`${styles.searchWrapper} bg-red h-50px rounded-full bg-gray-220 border-3 border-white border-opacity-60 bg-opacity-60 flex items-center pl-26px pr-2px`}>
      <input type="text"
             value={value}
             onChange={handleChange}
             placeholder={placeholder}
             className={"font-medium text-base text-fray-400 placeholder-gray-700 bg-transparent w-10/12"} />
      <Image src="/icons/magnifierBold.svg" alt="Magnifier" width={26} height={24} className={"w-2/12"} />
    </div>
)}

export default SearchInput
