import { ReactNode, useCallback } from "react";
import styles from './button.module.scss'
import { Sizes } from "../../types/Sizes";

export enum ButtonType {
  ACTIVE = 'ACTIVE',
  GHOST = 'GHOST'
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: (e) => void;
  leftIcon?: ReactNode;
  type?: ButtonType;
  size?: Sizes;
  disabled?: boolean;
  notClickable?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  leftIcon,
  type = ButtonType.ACTIVE,
  size = Sizes.MEDIUM,
  disabled = false,
  notClickable = false }) => {
  const handleClick = useCallback((e) => {
    onClick && onClick(e);
  }, [onClick]);

  return (
    <button onClick={handleClick}
      className={`bg-blue-400 relative flex justify-center items-center font-medium text-white text-xl rounded-70 uppercase cursor-pointer tracking-normal 
          ${styles.btn} 
          ${notClickable ? 'pointer-events-none' : ''}
          ${type === ButtonType.ACTIVE && !disabled
          ? styles.btnActive
          : type === ButtonType.GHOST
            ? styles.btnGhost
            : ''} 
          ${size === Sizes.SMALL
          ? styles.btnSmall
          : size === Sizes.NORMAL
            ? styles.btnNormal
            : size === Sizes.EXTRA_SMALL ?
              styles.btnExtraSmall
              : ''} 
          ${disabled ? 'bg-gray-250 cursor-not-allowed pointer-events-auto shadow-none filter-none' : ''}`}>
      {leftIcon &&
        <div className={'absolute top-18px left-20px'}>
          {leftIcon}
        </div>
      }
      {children}
    </button>
  )
}

export default Button

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean
  disabled?: boolean
} & ButtonProps) {
  if (error) {
    return <Button {...rest} />
  } else {
    return <Button disabled={disabled} {...rest} />
  }
}


export function ButtonConfirmed({
  confirmed,
  disabled,
  ...rest
}: { confirmed?: boolean; disabled?: boolean } & ButtonProps) {
  if (confirmed) {
    return (
      <Button
        disabled={disabled}
        {...rest}
      />
    )
  } else {
    return <Button disabled={disabled} {...rest} />
  }
}
