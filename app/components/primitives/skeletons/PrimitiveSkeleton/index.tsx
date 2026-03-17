import * as styles from './style.css'

export type PrimitiveSkeletonProps = {
  className?: string
  variant?: 'auto' | 'rectangle' | 'square' | 'circle' | 'bar'
  color?: 'sub'
}

export const PrimitiveSkeleton = ({ className, variant = 'auto', color = 'sub' }: PrimitiveSkeletonProps) => {
  return (
    <span
      className={[
        styles.primitiveSkeleton,
        styles[`primitiveSkeleton__${variant}`],
        styles[`primitiveSkeleton__${color}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
