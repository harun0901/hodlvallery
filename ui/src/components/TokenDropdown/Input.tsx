interface InputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  onFocus: () => void;
  onBlur: () => void;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, onFocus, onBlur }) => (
  <div className={'bg-white border-3 border-gray-260 h-50px rounded-full overflow-hidden'}>
    <input type="text"
           className={'w-full h-full text-center font-medium placeholder-gray-700 text-sm tracking-normal text-gray-700 px-20px'}
           value={value}
           onFocus={onFocus}
           onBlur={onBlur}
           placeholder={placeholder}
           onChange={(e) => {onChange(e.target.value)}}/>
  </div>
)

export default Input
