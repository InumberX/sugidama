const easingFunction = (t: number) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export const windowSmoothScroll = ({
  target,
  isNotAddBodyClassName = false,
  offset = 0,
}: {
  target: string
  isNotAddBodyClassName?: boolean
  offset?: number
}) => {
  const targetElm: HTMLBodyElement | null =
    target === '#' ? document.querySelector('body') : document.querySelector(target)

  // スクロール先が存在しない場合
  if (!targetElm) {
    return
  }

  const targetPosition: number = targetElm.getBoundingClientRect().top
  const winY: number = window.pageYOffset || document.documentElement.scrollTop
  const header = document.querySelector('.JsHeader')
  const headerHeight = header ? header.clientHeight : 0

  let startTime: number
  const start = window.scrollY
  const change = targetPosition + winY - headerHeight - 24 - start + offset

  const animateScroll = (timestamp: number) => {
    if (!startTime) {
      startTime = timestamp
    }

    const timeElapsed = timestamp - startTime
    const progress = easingFunction(Math.min(timeElapsed / 300, 1))
    const scrollPosition = start + change * progress

    window.scrollTo({
      top: scrollPosition,
    })

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll)

      return
    }

    document.body.classList.remove('Scrolling')
  }

  if (!isNotAddBodyClassName) {
    document.body.classList.add('Scrolling')
  }

  setTimeout(() => {
    window.requestAnimationFrame(animateScroll)
  }, 10)
}

export const elementSmoothScroll = ({
  offset = 0,
  duration = 300,
  target,
  scrollTarget,
  isScrollHorizontal,
}: {
  offset?: number
  duration?: number
  target: string
  scrollTarget: string
  isScrollHorizontal?: boolean
}) => {
  const scrollElement: HTMLElement | null = document.querySelector(scrollTarget)

  if (!scrollElement) {
    return
  }

  const targetElm: HTMLElement | null = scrollElement.querySelector(target)

  // スクロール先が存在しない場合
  if (!targetElm) {
    return
  }

  let startTime: number
  const start = isScrollHorizontal ? scrollElement.scrollLeft : scrollElement.scrollTop
  const rect = targetElm.getBoundingClientRect()
  const change = (isScrollHorizontal ? rect.left : rect.top) - start - offset

  const animateScroll = (timestamp: number) => {
    if (!startTime) {
      startTime = timestamp
    }

    const timeElapsed = timestamp - startTime
    const progress = easingFunction(Math.min(timeElapsed / duration, 1))
    const scrollPosition = start + change * progress

    if (isScrollHorizontal) {
      scrollElement.scrollLeft = scrollPosition
    } else {
      scrollElement.scrollTop = scrollPosition
    }

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll)

      return
    }

    document.body.classList.remove('Scrolling')
  }

  document.body.classList.add('Scrolling')

  setTimeout(() => {
    window.requestAnimationFrame(animateScroll)
  }, 10)
}
