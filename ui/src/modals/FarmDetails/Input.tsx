import styles from './farmDetails.module.scss'

interface InputProps {
  title: string;
  value: string;
  onChange: (val: string) => void;
}

const Input: React.FC<InputProps> = ({title, value, onChange}) => (
  <div className={styles.inputWrapper}>
    <p className={'uppercase font-medium text-xs text-gray-400 opacity-60 tracking-normal'}>{title}</p>
    <input type="text"
           className={'bg-transparent font-medium text-34px text-gray-400 text-right w-full leading-0'}
           value={value}
           onChange={e => onChange(e.target.value)} />
  </div>
)

export default Input;
