import styles from './menu.module.scss'
import Item from "./item"
import { ApplicationModal } from "../../state/modals/actions";
import { NetworkModal } from '../../modals';
import { useActiveWeb3React } from '../../hooks';
import Web3Network from '../Web3Network';
import Web3Status from '../Web3Status';
import { useETHBalances } from '../../state/wallet/hooks';
import useModals from "../../state/modals/hooks";

export enum MenuItemTypeModel {
  LINK = 'LINK',
  MODAL = 'MODAL',
  EXTERNAL_LINK = 'EXTERNAL_LINK'
}

export interface MenuItemModel {
  label: string;
  type?: MenuItemTypeModel;
  link?: string | ApplicationModal;
  subItems?: MenuItemModel[]
}

const menuList: MenuItemModel[] = [
  {
    label: 'DeFi', subItems: [
      { label: 'My Home', type: MenuItemTypeModel.LINK, link: '/home' },
      { label: 'Swap', type: MenuItemTypeModel.LINK, link: '/swapMeet' },
      { label: 'Pool', type: MenuItemTypeModel.LINK, link: '/pool' },
      { label: 'Farm', type: MenuItemTypeModel.LINK, link: '/farm' },
      { label: 'Lend' },
      { label: 'Borrow' },
      { label: 'Stake', type: MenuItemTypeModel.LINK, link: '/stake' },
      { label: 'Predict' },
      { label: 'Insure' },
      { label: 'Lock' },
      { label: 'Mint' },
      { label: 'Bulk Send' },
    ]
  },
  {label: 'ANALYTICS', subItems: [
      {label: 'Network', type: MenuItemTypeModel.LINK, link: '/network' },
      {label: 'Tokens', type: MenuItemTypeModel.LINK, link: '/tokens' },
      {label: 'Pools', type: MenuItemTypeModel.LINK, link: '/pools' },
      {label: 'Gainers', type: MenuItemTypeModel.LINK, link: '/gainers' },
      {label: 'Losers', type: MenuItemTypeModel.LINK, link: '/losers' },
    ]},
  {label: 'DOCS', type: MenuItemTypeModel.EXTERNAL_LINK, link: 'https://docs.hodlvalley.com' },
  {label: 'COMMUNITY', type: MenuItemTypeModel.EXTERNAL_LINK, link: 'https://discord.gg/GD44kaKXD8' },
];

const amount = 25683;

const Menu: React.FC = () => {
  const { account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const { openModal } = useModals();

  return (
    <div className={`${styles.wrapper} border-4 border-white flex justify-end items-center bg-opacity-100`}>
      <div className={'flex justify-end items-center'}>
        {menuList.map((item, index) => (
          <div className={styles.menuLinkWrapper} key={index}>
            <Item item={item} />
          </div>
        ))}
      </div>
      <div className={`${styles.walletBtn} flex items-center bg-red-400 border-4 border-red-500 h-full bg-opacity-100`}>
        <Web3Status />
      </div>
    </div>
  )
}

export default Menu
