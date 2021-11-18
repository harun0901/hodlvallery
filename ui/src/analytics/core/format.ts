import { timeFormat } from "d3-time-format";
import {toChecksumAddress} from "web3-utils";

const locales = ["en-US"];

export const currencyFormatter = new Intl.NumberFormat(locales, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const decimalFormatter = new Intl.NumberFormat(locales, {
  style: "decimal",
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 4,
});

export const formatDate = timeFormat("%b %d, '%y");

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatDecimal(value) {
  return decimalFormatter.format(value);
}

export function formatAddress(value) {
  return value;
}

export function shortenAddress (address) {
  const prefix = address.startsWith('0x') ? '0x' : ''
  return `${prefix}${address.replace('0x', '').substring(0, 24)}...${address.substring(address.length - 4)}`
}

export function getTokenIconFromID ({id}) {
  console.log(id)
  return `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${toChecksumAddress(id)}/logo.png`
}
