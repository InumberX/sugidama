import { createGlobalTheme } from '@vanilla-extract/css'

const changeColorHexToRgb = (hex: string) => {
  const hexValue =
    hex.slice(0, 1) === '#'
      ? hex.length === 4
        ? hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3) + hex.slice(3, 4) + hex.slice(3, 4)
        : hex.slice(1)
      : hex.length === 3
        ? hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3)
        : hex

  return [hexValue.slice(0, 2), hexValue.slice(2, 4), hexValue.slice(4, 6)]
    .map((value) => {
      return parseInt(value, 16)
    })
    .join(', ')
}

export const cssVariables = createGlobalTheme(':root', {
  // Define colors to be used
  color: {
    font: {
      base: {
        hex: '#2c2c2c',
        rgb: changeColorHexToRgb('#2c2c2c'),
      },
      light: {
        hex: '#fff',
        rgb: changeColorHexToRgb('#fff'),
      },
      primary: {
        hex: '#a2beed',
        rgb: changeColorHexToRgb('#a2beed'),
      },
      primaryDark: {
        hex: '#76a3ed',
        rgb: changeColorHexToRgb('#76a3ed'),
      },
      subDark: {
        hex: '#858585',
        rgb: changeColorHexToRgb('#858585'),
      },
      mark: {
        hex: '#fff',
        rgb: changeColorHexToRgb('#fff'),
      },
      placeholder: {
        hex: '#bebebe',
        rgb: changeColorHexToRgb('#bebebe'),
      },
    },
    background: {
      body: {
        hex: '#fff',
        rgb: changeColorHexToRgb('#fff'),
      },
      light: {
        hex: '#fff',
        rgb: changeColorHexToRgb('#fff'),
      },
      subDark: {
        hex: '#858585',
        rgb: changeColorHexToRgb('#858585'),
      },
      subLight: {
        hex: '#efefef',
        rgb: changeColorHexToRgb('#efefef'),
      },
      mark: {
        hex: '#000',
        rgb: changeColorHexToRgb('#000'),
      },
    },
    border: {
      sub: {
        hex: '#bebebe',
        rgb: changeColorHexToRgb('#bebebe'),
      },
      subDark: {
        hex: '#858585',
        rgb: changeColorHexToRgb('#858585'),
      },
    },
    gradation: {
      primary: 'oklch(74.9% 0.118 183.4) 0, oklch(78.5% 0.175 155.1) 100%',
      primaryDark: 'oklch(67.2% 0.101 184.2) 0, oklch(70% 0.147 156.6) 100%',
    },
    // Please use the following sites for key names
    // https://chir.ag/projects/name-that-color/
    util: {
      black: {
        hex: '#000',
        rgb: changeColorHexToRgb('#000'),
      },
    },
  },
  shadow: {},
  font: {
    family: {
      main: '"游ゴシック Medium", "Yu Gothic", YuGothic, YuGothicMedium, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
    },
    weight: {
      // thin: '100',
      // extraLight: '200',
      // light: '300',
      // regular: '400',
      medium: '500',
      // semiBold: '600',
      bold: '700',
      // extraBold: '800',
      // black: '900',
    },
  },
  opacity: {
    hover: '0.6',
    disabled: '0.4',
  },
  layout: {
    inner: {
      width: {
        large: '1400px',
      },
      padding: {
        xs: '4vw',
        sm: '4.6vw',
        md: '32px',
      },
    },
    header: {},
  },
  scale: {
    hover: '1.16',
  },
  leadingTrim: 'calc((1em - 1lh) / 2)',
  zIndex: {
    header: {
      wrapper: '10000',
      menu: '10100',
      global: '10200',
    },
  },
})
