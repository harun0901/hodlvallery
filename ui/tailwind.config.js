const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  // important: '#__next',
  // darkMode: true,
  mode: 'jit',
  future: {
    purgeLayersByDefault: true,
    applyComplexClasses: true,
  },
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: theme => ({
        'valley-pattern': "url('/images/valley.png')",
      }),
      colors: {
        yellow: {
          400: '#ffc400'
        },
        gray: {
          50: '#F9F9F9',
          100: '#ededed',
          150: '#85939f',
          200: '#F5F5F5',
          210: '#f8f8f8',
          220: '#fcfcfc',
          250: '#D5D5D5',
          260: '#e5e5e5',
          270: '#c1c4c8',
          290: '#d2d5d9',
          300: '#707D89',
          310: '#747b85',
          320: '#4a586c',
          350: '#767f8e',
          400: '#21314A',
          600: '#707070',
          700: '#788190',
          750: '#898989',
          800: '#475669'
        },
        red: {
          300: '#FF6E6E',
          400: '#FF3434',
          500: '#E60000'
        },
        green: {
          200: '#09ba88',
          300: '#00AE46',
          350: '#009865',
          360: '#09ba87',
          400: '#1FAD7B',
          500: '#178657',
          600: '#007B32'
        },
        blue: {
          300: '#0665ff',
          400: '#0062FF',
          500: '#0059e6',
        }
      },
      borderWidth: {
        3: '3px',
        5: '5px',
        10: '10px'
      },
      borderRadius: {
        16: '16px',
        52: '52px',
        55: '55px',
        60: '60px',
        70: '70px',
        80: '80px'
      },
      spacing: {
        '1px': '1px',
        '2px': '2px',
        '3px': '3px',
        '4px': '4px',
        '5px': '5px',
        '6px': '6px',
        '7px': '7px',
        '8px': '8px',
        '9px': '9px',
        '10px': '10px',
        '11px': '11px',
        '12px': '12px',
        '13px': '13px',
        '14px': '14px',
        '15px': '15px',
        '16px': '16px',
        '17px': '17px',
        '18px': '18px',
        '19px': '19px',
        '20px': '20px',
        '21px': '21px',
        '22px': '22px',
        '24px': '24px',
        '25px': '25px',
        '26px': '26px',
        '27px': '27px',
        '28px': '28px',
        '29px': '29px',
        '30px': '30px',
        '31px': '31px',
        '32px': '32px',
        '33px': '33px',
        '34px': '34px',
        '35px': '35px',
        '36px': '36px',
        '37px': '37px',
        '38px': '38px',
        '40px': '40px',
        '41px': '41px',
        '42px': '42px',
        '43px': '43px',
        '44px': '44px',
        '45px': '45px',
        '46px': '46px',
        '47px': '47px',
        '48px': '48px',
        '50px': '50px',
        '51px': '51px',
        '52px': '52px',
        '53px': '53px',
        '55px': '55px',
        '56px': '56px',
        '58px': '58px',
        '59px': '59px',
        '60px': '60px',
        '65px': '65px',
        '66px': '66px',
        '67px': '67px',
        '70px': '70px',
        '71px': '71px',
        '72px': '72px',
        '73px': '73px',
        '74px': '74px',
        '76px': '76px',
        '77px': '77px',
        '78px': '78px',
        '80px': '80px',
        '81px': '81px',
        '89px': '89px',
        '90px': '90px',
        '93px': '93px',
        '100px': '100px',
        '110px': '110px'
      },
      fontSize: {
        '11px': '11px',
        '15px': '15px',
        '22px': '22px',
        '25px': '25px',
        '26px': '26px',
        '28px': '28px',
        '32px': '32px',
        '34px': '34px',
        '35px': '35px',
        '40px': '40px',
        '46px': '46px',
        '60px': '60px'
      },
      lineHeight: {
        '14': '4rem',
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  }
}
