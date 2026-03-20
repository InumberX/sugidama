import { PrimitiveSkeleton } from '~/components/primitives/skeletons/PrimitiveSkeleton'

import * as styles from './style.css'

type ArticleCardListSkeletonProps = {
  className?: string
  listLength: number
}

export const ArticleCardListSkeleton = ({ className, listLength }: ArticleCardListSkeletonProps) => {
  return (
    <div className={[styles.articleCardListSkeleton, className].filter(Boolean).join(' ')}>
      <div className={styles.articleCardListSkeleton_items}>
        {Array.from({ length: listLength }).map((_, i) => (
          <div key={`${listLength}-${i}`} className={styles.articleCardListSkeleton_item}>
            <div className={styles.articleCardListSkeletonCard}>
              <div className={styles.articleCardListSkeletonCardTitle}>
                <div className={styles.articleCardListSkeletonCardTitle_container}>
                  <PrimitiveSkeleton className={styles.articleCardListSkeletonCardTitle_skeleton} variant="bar" />
                  <PrimitiveSkeleton className={styles.articleCardListSkeletonCardTitle_skeleton} variant="bar" />
                </div>
              </div>

              <div className={styles.articleCardListSkeletonCardDescription}>
                <div className={styles.articleCardListSkeletonCardDescription_container}>
                  <PrimitiveSkeleton className={styles.articleCardListSkeletonCardDescription_skeleton} variant="bar" />
                </div>
              </div>

              <div className={styles.articleCardListSkeletonCardThumbnail}>
                <div className={styles.articleCardListSkeletonCardThumbnail_container}>
                  <PrimitiveSkeleton
                    className={styles.articleCardListSkeletonCardThumbnail_skeleton}
                    variant="rectangle"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
