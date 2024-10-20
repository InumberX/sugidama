import { type StandardLonghandPropertiesHyphen } from 'csstype'

export const getTransition = (
  transitions: {
    speed?: number
    delay?: number
    property: keyof StandardLonghandPropertiesHyphen | 'border-color' | 'padding' | 'fill'
  }[]
) => {
  return transitions
    .map((transition) => {
      return `${transition.speed ?? 0.3}s${transition.delay ? ' ' + transition.delay + 's' : ''} ${transition.property}`
    })
    .join(', ')
}
