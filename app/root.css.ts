import { style, globalStyle } from '@vanilla-extract/css'

import { getFontSize } from '~/styles/mixins/font.css'
import { getMediaQuery, getContainerQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampRem } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { cssLayerReset, cssLayerComponentPage, cssLayerUtils } from '~/styles/variables/layers.css'

/* Common ========== */

/* Reset:Base */
globalStyle('*, *:before, *:after', {
  '@layer': {
    [cssLayerReset]: {
      boxSizing: 'border-box',
    },
  },
})

globalStyle('html', {
  '@layer': {
    [cssLayerReset]: {
      background: cssVariables.color.background.body.hex,
      color: cssVariables.color.font.base.hex,
      blockSize: '100%',
      lineHeight: 1,
      inlineSize: '100%',
    },
  },
})

globalStyle('body', {
  '@layer': {
    [cssLayerReset]: {
      backgroundAttachment: 'fixed',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      borderBlock: 0,
      borderInline: 0,
      fontFamily: cssVariables.font.family.main,
      fontWeight: cssVariables.font.weight.medium,
      inlineSize: '100%',
      lineHeight: 1.6,
      marginBlock: 0,
      marginInline: 0,
      overflow: 'clip auto',
      paddingBlock: 0,
      paddingInline: 0,
      WebkitTextSizeAdjust: '100%',
      textSizeAdjust: '100%',
    },
  },
})

globalStyle(
  'article, aside, details, figcaption, include, footer, header, hgroup, main, nav, section, summary, figure',
  {
    '@layer': {
      [cssLayerReset]: {
        display: 'block',
        marginBlock: 0,
        marginInline: 0,
        paddingBlock: 0,
        paddingInline: 0,
      },
    },
  }
)

globalStyle('h1, h2, h3, h4, h5, h6, dl, dt, dd, p, blockquote, ul, ol, li', {
  '@layer': {
    [cssLayerReset]: {
      marginBlock: 0,
      marginInline: 0,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      WebkitOverflowWrap: 'break-word',
      overflowWrap: 'break-word',
      paddingBlock: 0,
      paddingInline: 0,
      verticalAlign: 'baseline',
      WebkitWordWrap: 'break-word',
      wordWrap: 'break-word',
    },
  },
})

globalStyle('ul, ol', {
  '@layer': {
    [cssLayerReset]: {
      listStyle: 'none',
    },
  },
})

globalStyle('figcaption, span', {
  '@layer': {
    [cssLayerReset]: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      WebkitOverflowWrap: 'break-word',
      overflowWrap: 'break-word',
      WebkitWordWrap: 'break-word',
      wordWrap: 'break-word',
    },
  },
})

globalStyle('audio, canvas, progress, video', {
  '@layer': {
    [cssLayerReset]: {
      display: 'inline-block',
      verticalAlign: 'baseline',
    },
  },
})

globalStyle('audio:not([controls])', {
  '@layer': {
    [cssLayerReset]: {
      display: 'none',
      height: 0,
    },
  },
})

globalStyle('[hidden]:not([hidden="until-found"]), template', {
  '@layer': {
    [cssLayerReset]: {
      display: 'none',
    },
  },
})

globalStyle('a', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.primary.hex,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'opacity',
        },
        {
          property: 'background-color',
        },
        {
          property: 'border-color',
        },
      ]),
    },
  },
})

globalStyle('a:link, a:visited', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.primary.hex,
      textDecoration: 'none',
    },
  },
})

globalStyle('a:hover, a:active', {
  '@layer': {
    [cssLayerReset]: {
      '@media': {
        [getMediaQuery('hover')]: {
          color: cssVariables.color.font.primaryDark.hex,
          textDecoration: 'underline',
        },
      },
    },
  },
})

globalStyle('button', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'pointer',
      fontFamily: cssVariables.font.family.main,
      fontWeight: cssVariables.font.weight.medium,
    },
  },
})

globalStyle('abbr[title]', {
  '@layer': {
    [cssLayerReset]: {
      borderBlockEnd: '1px dotted',
    },
  },
})

globalStyle('i, em, address', {
  '@layer': {
    [cssLayerReset]: {
      fontStyle: 'normal',
    },
  },
})

globalStyle('b, strong, em', {
  '@layer': {
    [cssLayerReset]: {
      fontWeight: cssVariables.font.weight.bold,
    },
  },
})

globalStyle('dfn', {
  '@layer': {
    [cssLayerReset]: {
      fontStyle: 'italic',
    },
  },
})

globalStyle('mark', {
  '@layer': {
    [cssLayerReset]: {
      backgroundColor: cssVariables.color.background.mark.hex,
      color: cssVariables.color.font.mark.hex,
    },
  },
})

globalStyle('small', {
  '@layer': {
    [cssLayerReset]: {
      fontSize: '100%',
    },
  },
})

globalStyle('sup, sub', {
  '@layer': {
    [cssLayerReset]: {
      fontSize: '75%',
      lineHeight: 0,
      position: 'relative',
      verticalAlign: 'baseline',
    },
  },
})

globalStyle('sup', {
  '@layer': {
    [cssLayerReset]: {
      insetBlockStart: '-0.5em',
    },
  },
})

globalStyle('sub', {
  '@layer': {
    [cssLayerReset]: {
      insetBlockEnd: '-0.25em',
    },
  },
})

globalStyle('img', {
  '@layer': {
    [cssLayerReset]: {
      borderBlock: 'none',
      borderInline: 'none',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      interpolationMode: 'bicubic',
      maxInlineSize: '100%',
      verticalAlign: 'top',
    },
  },
})

globalStyle('svg', {
  '@layer': {
    [cssLayerReset]: {
      overflow: 'hidden',
    },
  },
})

globalStyle('hr', {
  '@layer': {
    [cssLayerReset]: {
      blockSize: 0,
      boxSizing: 'content-box',
    },
  },
})

globalStyle('pre', {
  '@layer': {
    [cssLayerReset]: {
      overflow: 'auto',
    },
  },
})

globalStyle('code, kbd, pre, samp', {
  '@layer': {
    [cssLayerReset]: {
      fontFamily: cssVariables.font.family.main,
      fontSize: getFontSize(10),
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
    },
  },
})

globalStyle('table', {
  '@layer': {
    [cssLayerReset]: {
      borderCollapse: 'collapse',
      borderSpacing: 0,
    },
  },
})

globalStyle('td, th', {
  '@layer': {
    [cssLayerReset]: {
      paddingBlock: 0,
      paddingInline: 0,
    },
  },
})

globalStyle('[role="tabpanel"]:target', {
  '@layer': {
    [cssLayerReset]: {
      display: 'revert',
    },
  },
})

globalStyle('body, h1, h2, h3, h4, h5, h6, dl, dt, dd, p, blockquote, ul, ol, li', {
  '@layer': {
    [cssLayerReset]: {
      fontSize: getClampRem(14, 16),
    },
  },
})

/* Reset:Form */
globalStyle('form', {
  '@layer': {
    [cssLayerReset]: {
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
    },
  },
})

globalStyle('fieldset', {
  '@layer': {
    [cssLayerReset]: {
      border: 'none',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
    },
  },
})

globalStyle('legend', {
  '@layer': {
    [cssLayerReset]: {
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 0,
      paddingInline: 0,
    },
  },
})

globalStyle('optgroup', {
  '@layer': {
    [cssLayerReset]: {
      fontWeight: cssVariables.font.weight.bold,
    },
  },
})

globalStyle('label', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'pointer',
      display: 'block',
    },
  },
})

globalStyle('button, input, optgroup, select, textarea', {
  '@layer': {
    [cssLayerReset]: {
      boxSizing: 'border-box',
      color: cssVariables.color.font.base.hex,
      fontFamily: cssVariables.font.family.main,
      fontWeight: cssVariables.font.weight.medium,
      lineHeight: 1.6,
      marginBlock: 0,
      marginInline: 0,
      outline: 0,
      fontSize: getFontSize(16),
    },
  },
})

globalStyle('button::-moz-focus-inner, input::-moz-focus-inner', {
  '@layer': {
    [cssLayerReset]: {
      border: 'none',
      paddingBlock: 0,
      paddingInline: 0,
    },
  },
})

globalStyle(
  'input[type="text"], input[type="tel"], input[type="email"], input[type="date"], input[type="month"], input[type="search"], input[type="password"], input[type="reset"], input[type="number"]',
  {
    '@layer': {
      [cssLayerReset]: {
        appearance: 'none',
        lineHeight: 1.6,
        fontSize: getFontSize(16),
      },
    },
  }
)

globalStyle('input:focus', {
  '@layer': {
    [cssLayerReset]: {
      outline: 0,
    },
  },
})

globalStyle('input:disabled', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'not-allowed',
    },
  },
})

globalStyle('input[type="file"]:disabled', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'not-allowed',
    },
  },
})

globalStyle('input[readonly]', {
  '@layer': {
    [cssLayerReset]: {
      pointerEvents: 'none',
    },
  },
})

globalStyle('input[readonly]:hover', {
  '@layer': {
    [cssLayerReset]: {
      '@media': {
        [getMediaQuery('hover')]: {
          pointerEvents: 'none',
        },
      },
    },
  },
})

globalStyle('input[type="number"]', {
  '@layer': {
    [cssLayerReset]: {
      appearance: 'textfield',
    },
  },
})

globalStyle('input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button', {
  '@layer': {
    [cssLayerReset]: {
      appearance: 'none',
      blockSize: 'auto',
      marginBlock: 0,
      marginInline: 0,
    },
  },
})

globalStyle('input[type="button"], input[type="submit"]', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'pointer',
    },
  },
})

globalStyle('input[type="button"]:disabled, input[type="submit"]:disabled', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'not-allowed',
    },
  },
})

globalStyle('button, html input[type="button"], input[type="reset"], input[type="submit"]', {
  '@layer': {
    [cssLayerReset]: {
      appearance: 'button',
      cursor: 'pointer',
    },
  },
})

globalStyle('button[disabled], html input[disabled]', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'not-allowed',
    },
  },
})

globalStyle('select', {
  '@layer': {
    [cssLayerReset]: {
      appearance: 'none',
      cursor: 'pointer',
      lineHeight: 1.6,
    },
  },
})

globalStyle('select:focus', {
  '@layer': {
    [cssLayerReset]: {
      outline: 0,
    },
  },
})

globalStyle('select:disabled', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'not-allowed',
    },
  },
})

globalStyle('select[readonly]', {
  '@layer': {
    [cssLayerReset]: {
      pointerEvents: 'none',
    },
  },
})

globalStyle('select[readonly]:hover', {
  '@layer': {
    [cssLayerReset]: {
      '@media': {
        [getMediaQuery('hover')]: {
          pointerEvents: 'none',
        },
      },
    },
  },
})

globalStyle('textarea', {
  '@layer': {
    [cssLayerReset]: {
      appearance: 'none',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fieldSizing: 'content',
      lineHeight: 1.6,
      resize: 'vertical',
      fontSize: getFontSize(16),
    },
  },
})

globalStyle('textarea:focus', {
  '@layer': {
    [cssLayerReset]: {
      outline: 0,
    },
  },
})

globalStyle('textarea:disabled', {
  '@layer': {
    [cssLayerReset]: {
      cursor: 'not-allowed',
    },
  },
})

globalStyle('textarea[readonly]', {
  '@layer': {
    [cssLayerReset]: {
      pointerEvents: 'none',
    },
  },
})

globalStyle('textarea[readonly]:hover', {
  '@layer': {
    [cssLayerReset]: {
      '@media': {
        [getMediaQuery('hover')]: {
          pointerEvents: 'none',
        },
      },
    },
  },
})

globalStyle(':placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('::placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle(':input-placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('::input-placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('input:placeholder, textarea:placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('input::placeholder, textarea::placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('input:input-placeholder, textarea:input-placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('input::input-placeholder, textarea::input-placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: cssVariables.color.font.placeholder.hex,
    },
  },
})

globalStyle('input:focus:placeholder, textarea:focus:placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: 'transparent',
    },
  },
})

globalStyle('input:focus::placeholder, textarea:focus::placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: 'transparent',
    },
  },
})

globalStyle('input:focus:input-placeholder, textarea:focus:input-placeholder', {
  '@layer': {
    [cssLayerReset]: {
      color: 'transparent',
    },
  },
})

globalStyle('input:focus::input-placeholder, textarea:focus::input-placeholder ', {
  '@layer': {
    [cssLayerReset]: {
      color: 'transparent',
    },
  },
})

/* Utils ========== */

/* clearfix */
globalStyle('.clearfix', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'block',
    },
  },
})

globalStyle('.clearfix:before, .clearfix:after', {
  '@layer': {
    [cssLayerUtils]: {
      content: '',
      display: 'block',
    },
  },
})

globalStyle('.clearfix:after', {
  '@layer': {
    [cssLayerUtils]: {
      clear: 'both',
    },
  },
})

/* obj */
globalStyle('.obj__xs', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'block',

      '@media': {
        [getMediaQuery('xs')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__sm', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@media': {
        [getMediaQuery('xs')]: {
          display: 'block',
        },

        [getMediaQuery('sm')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__md', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@media': {
        [getMediaQuery('sm')]: {
          display: 'block',
        },

        [getMediaQuery('md')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__lg', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@media': {
        [getMediaQuery('md')]: {
          display: 'block',
        },

        [getMediaQuery('lg')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__xl', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@media': {
        [getMediaQuery('lg')]: {
          display: 'block',
        },

        [getMediaQuery('xl')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__xxl', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@media': {
        [getMediaQuery('xl')]: {
          display: 'block',
        },
      },
    },
  },
})

globalStyle('.obj__xs--container', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'block',

      '@container': {
        [getContainerQuery('xs')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__sm--container', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@container': {
        [getContainerQuery('xs')]: {
          display: 'block',
        },

        [getContainerQuery('sm')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__md--container', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@container': {
        [getContainerQuery('sm')]: {
          display: 'block',
        },

        [getContainerQuery('md')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__lg--container', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@container': {
        [getContainerQuery('md')]: {
          display: 'block',
        },

        [getContainerQuery('lg')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__xl--container', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@container': {
        [getContainerQuery('lg')]: {
          display: 'block',
        },

        [getContainerQuery('xl')]: {
          display: 'none',
        },
      },
    },
  },
})

globalStyle('.obj__xxl--container', {
  '@layer': {
    [cssLayerUtils]: {
      display: 'none',

      '@container': {
        [getMediaQuery('xl')]: {
          display: 'block',
        },
      },
    },
  },
})

export const layoutRoot = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const layoutRootStorybook = style({
  '@layer': {
    [cssLayerComponentPage]: {
      containerType: 'inline-size',
      minBlockSize: '80svb',
    },
  },
})
