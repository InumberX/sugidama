import { AnimatePresence, motion, type MotionStyle } from 'framer-motion'
import { type ReactNode } from 'react'

type Props = {
  children?: ReactNode
  isShow: boolean
  transitionSpeed?: number
  className?: string
  style?: MotionStyle
  motionTag?: 'div' | 'span'
  id?: string
}

export const TransitionFade = ({
  children,
  isShow,
  transitionSpeed = 0.3,
  className,
  style,
  motionTag = 'div',
  id,
}: Props) => {
  const MotionTag = motion[motionTag]

  return (
    <AnimatePresence mode="wait">
      {isShow && (
        <MotionTag
          id={id}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: transitionSpeed,
          }}
          className={className}
          style={style}
        >
          {children}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}
