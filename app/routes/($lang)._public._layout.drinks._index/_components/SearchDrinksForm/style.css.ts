import { style } from '@vanilla-extract/css'

import { getContainerQuery, getMediaQuery, getContainerQueryReverse } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontMinimumBold, fontSmall, fontSmallBold } from '~/styles/variables/font.css'
import { cssLayerComponentPage } from '~/styles/variables/layers.css'

export const searchDrinksForm = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksForm_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
    },
  },
})

export const searchDrinksFormInputs = style({
  '@layer': {
    [cssLayerComponentPage]: {
      position: 'relative',
      zIndex: 1,

      '@container': {
        [getContainerQuery('md')]: {
          paddingBlockEnd: getClampPx(16, 24),
        },
      },
    },
  },
})

export const searchDrinksFormInputs_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 16,
    },
  },
})

export const searchDrinksFormInputsHeader = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksFormInputsHeaderReset = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      justifyContent: 'flex-end',

      '@container': {
        [getContainerQuery('md')]: {
          justifyContent: 'flex-start',
        },
      },
    },
  },
})

export const searchDrinksFormInputsHeaderReset_icon = style({
  '@layer': {
    [cssLayerComponentPage]: {
      flexShrink: 0,
      marginInlineEnd: 8,
      backgroundColor: cssVariables.color.background.sub.hex,
      inlineSize: 20,
    },
  },
})

export const searchDrinksFormInputs_contents = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksFormKeyword = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksSideBottom = style({
  '@layer': {
    [cssLayerComponentPage]: {
      backgroundColor: cssVariables.color.background.light.hex,
      inlineSize: '100%',
      paddingBlock: '16px 0px',

      '@container': {
        [getContainerQuery('md')]: {
          paddingBlock: 16,
          borderBlockStart: `1px solid ${cssVariables.color.border.sub.hex}`,
          insetBlockEnd: 0,
          insetInlineStart: 0,
          position: 'sticky',
          zIndex: 2,
        },
      },
    },
  },
})

export const searchDrinksSideBottom_items = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16,

      '@container': {
        [getContainerQuery('md')]: {
          gridTemplateColumns: '1fr',
        },
      },
    },
  },
})

export const searchDrinksSideBottom_item__conditions = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksSideBottom_item = style({
  '@layer': {
    [cssLayerComponentPage]: {
      selectors: {
        [`&${searchDrinksSideBottom_item__conditions}`]: {
          '@container': {
            [getContainerQuery('md')]: {
              display: 'none',
            },
          },
        },
      },
    },
  },
})

export const searchDrinksSideBottom_button = style({
  '@layer': {
    [cssLayerComponentPage]: {
      inlineSize: '100%',
    },
  },
})

export const searchDrinksConditions__active = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksConditions = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateRows: '0fr',
      transition: getTransition([
        {
          property: 'grid-template-rows',
        },
      ]),

      selectors: {
        [`${searchDrinksConditions__active}&`]: {
          gridTemplateRows: '1fr',
        },
      },

      '@media': {
        [getMediaQuery('not-scripting')]: {
          selectors: {
            '&:target': {
              display: 'revert',
            },
          },
        },
      },

      '@container': {
        [getContainerQuery('md')]: {
          contentVisibility: 'visible',
          display: 'block',
        },
      },
    },
  },
})

export const searchDrinksConditions_wrapper = style({
  '@layer': {
    [cssLayerComponentPage]: {
      overflow: 'hidden',
    },
  },
})

export const searchDrinksConditions_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      paddingBlockStart: 16,
    },
  },
})

export const searchDrinksConditionsButtons = style({
  '@layer': {
    [cssLayerComponentPage]: {
      borderBlockEnd: `1px solid ${cssVariables.color.border.sub.hex}`,
      overflow: 'auto clip',

      '@container': {
        [getContainerQuery('md')]: {
          display: 'none',
        },
      },
    },
  },
})

export const searchDrinksConditionsButtons_items = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
    },
  },
})

export const searchDrinksConditionsButtons_item = style({
  '@layer': {
    [cssLayerComponentPage]: {
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
  },
})

export const searchDrinksConditionsButtons_button = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmall,
      alignItems: 'center',
      backgroundColor: 'transparent',
      blockSize: '100%',
      borderBlock: 'none',
      borderInline: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      color: cssVariables.color.font.subDark.hex,
      display: 'flex',
      inlineSize: 'auto',
      justifyContent: 'flex-start',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 4,
      paddingInline: getClampPx(12, 24),
      position: 'relative',
      textAlign: 'start',
      textDecoration: 'none',
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'font-weight',
        },
      ]),

      selectors: {
        '&::before': {
          background: `linear-gradient(90deg, ${cssVariables.color.gradation.primary})`,
          blockSize: 2,
          content: '',
          display: 'block',
          inlineSize: '100%',
          insetBlockEnd: 0,
          insetInlineStart: 0,
          opacity: 0,
          position: 'absolute',
          transition: getTransition([
            {
              property: 'opacity',
            },
          ]),
        },

        '&[role="tab"][aria-selected="true"]': {
          ...fontSmallBold,
          color: cssVariables.color.font.primary.hex,
        },

        '&[role="tab"][aria-selected="true"]::before': {
          opacity: 1,
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const searchDrinksConditionsButtons_contents = style({
  '@layer': {
    [cssLayerComponentPage]: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
  },
})

export const searchDrinksConditionsButtons_text = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
    },
  },
})

export const searchDrinksConditionsButtonsCount = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
      marginInlineStart: 8,
    },
  },
})

export const searchDrinksConditionsButtonsCount_text = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMinimumBold,
      alignItems: 'center',
      aspectRatio: '1 / 1',
      backgroundColor: cssVariables.color.background.primaryLight.hex,
      borderRadius: 'calc(infinity * 1px)',
      color: cssVariables.color.font.subDark.hex,
      display: 'flex',
      inlineSize: 20,
      justifyContent: 'center',
    },
  },
})

export const searchDrinksConditionsContents = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksConditionsContents_items = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksConditionsContents_item = style({
  '@layer': {
    [cssLayerComponentPage]: {
      '@media': {
        [getMediaQuery('not-scripting')]: {
          selectors: {
            '&:target': {
              display: 'revert',
            },
          },
        },
      },

      '@container': {
        [getContainerQuery('md')]: {
          contentVisibility: 'visible',
          display: 'block',
        },
      },
    },
  },
})

export const searchDrinksConditionsContents_contents = style({
  '@layer': {
    [cssLayerComponentPage]: {
      overflow: 'hidden',
    },
  },
})

export const searchDrinksConditionsContentsHeader = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'none',

      '@container': {
        [getContainerQuery('md')]: {
          display: 'block',
        },
      },
    },
  },
})

export const searchDrinksConditionsContentsHeader_container = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksConditionsContentsHeaderButton = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontSmallBold,
      alignItems: 'center',
      backgroundColor: 'transparent',
      blockSize: '100%',
      borderBlockStart: `1px solid ${cssVariables.color.border.sub.hex}`,
      borderBlockEnd: 'none',
      borderInline: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      color: cssVariables.color.font.subDark.hex,
      display: 'flex',
      inlineSize: 'auto',
      justifyContent: 'flex-start',
      marginBlock: 0,
      marginInline: 0,
      paddingBlock: 12,
      paddingInline: 0,
      position: 'relative',
      textAlign: 'start',
      textDecoration: 'none',
      transition: getTransition([
        {
          property: 'color',
        },
        {
          property: 'background-color',
        },
      ]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const searchDrinksConditionsContentsHeaderButton_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
    },
  },
})

export const searchDrinksConditionsContentsHeaderButton_contents = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
    },
  },
})

export const searchDrinksConditionsContentsHeaderButton_text = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
    },
  },
})

export const searchDrinksConditionsContentsHeaderButtonCount = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'block',
      marginInlineStart: 8,
    },
  },
})

export const searchDrinksConditionsContentsHeaderButtonCount_text = style({
  '@layer': {
    [cssLayerComponentPage]: {
      ...fontMinimumBold,
      alignItems: 'center',
      aspectRatio: '1 / 1',
      backgroundColor: cssVariables.color.background.primaryLight.hex,
      borderRadius: 'calc(infinity * 1px)',
      color: cssVariables.color.font.subDark.hex,
      display: 'flex',
      inlineSize: 20,
      justifyContent: 'center',
    },
  },
})

export const searchDrinksConditionsContentsHeaderButtonCount_arrow = style({
  '@layer': {
    [cssLayerComponentPage]: {
      backgroundColor: cssVariables.color.background.subDark.hex,
      flexShrink: 0,
      marginInlineStart: 16,
      inlineSize: 24,
      transition: getTransition([
        {
          property: 'background-color',
        },
        {
          property: 'rotate',
        },
      ]),

      selectors: {
        [`${searchDrinksConditionsContentsHeaderButton}[aria-expanded="true"] &`]: {
          rotate: '-180deg',
        },
      },

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`${searchDrinksConditionsContentsHeaderButton}:hover &`]: {
              backgroundColor: cssVariables.color.background.primary.hex,
            },
          },
        },
      },
    },
  },
})

export const searchDrinksConditionsContentsBody__active = style({
  '@layer': {
    [cssLayerComponentPage]: {},
  },
})

export const searchDrinksConditionsContentsBody = style({
  '@layer': {
    [cssLayerComponentPage]: {
      display: 'grid',
      gridTemplateRows: '0fr',
      transition: getTransition([
        {
          property: 'grid-template-rows',
        },
      ]),

      selectors: {
        [`${searchDrinksConditionsContentsBody__active}&`]: {
          gridTemplateRows: '1fr',
        },
      },

      '@media': {
        [getMediaQuery('not-scripting')]: {
          selectors: {
            '&:target': {
              display: 'revert',
            },
          },
        },
      },

      '@container': {
        [getContainerQueryReverse('md')]: {
          contentVisibility: 'visible',
          display: 'block',
        },
      },
    },
  },
})

export const searchDrinksConditionsContentsBody_container = style({
  '@layer': {
    [cssLayerComponentPage]: {
      overflow: 'hidden',
    },
  },
})

export const searchDrinksConditionsContentsBody_contents = style({
  '@layer': {
    [cssLayerComponentPage]: {
      backgroundColor: cssVariables.color.background.body.hex,
      maxBlockSize: 320,
      overflow: 'clip auto',
      paddingBlock: getClampPx(16, 12),
      paddingInline: getClampPx(16, 12),

      '@container': {
        [getContainerQuery('md')]: {
          borderBlockStart: `1px solid ${cssVariables.color.border.sub.hex}`,
          maxBlockSize: 'none',
          overflow: 'visible',
        },
      },
    },
  },
})
