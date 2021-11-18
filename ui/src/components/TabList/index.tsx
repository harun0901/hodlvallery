import styles from './tabList.module.scss'

export interface TabItemModel {
  label: string;
  value: string;
}

interface TabListProps {
  items: TabItemModel[];
  onSelect: (value: TabItemModel) => void;
  activeItem?: TabItemModel;
}

const TabList: React.FC<TabListProps> = ({items, activeItem, onSelect}) => (
  <div className='flex items-center'>
    {items.map((item, index) => (
      <div className={`${styles.tab} border-gray-260 cursor-pointer flex justify-center items-center rounded-full px-25px last:mr-0 ${activeItem?.value === item.value ? `${styles.tabShadowed} bg-white border-3 mr-12px` : 'mr-15px'}`}
           key={index}
           onClick={() => onSelect(item)}>
        <p className={`font-medium text-xl text-gray-400 ${activeItem?.value === item.value ? '' : 'text-opacity-60'}`}>{item.label}</p>
      </div>
    ))}
  </div>
)

export default TabList
