import { LANG } from '~/config/consts'
import { NO_INDEX, SITE_URL } from '~/config/env'
import { getSiteInfo } from '~/utils/locale'

import type { MetaDescriptor } from 'react-router'
import type { MetaArgs } from 'react-router'

import type { Route } from '~/+types/root'

type Props = {
  args: MetaArgs
  title?: string
  description?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary_large_image' | 'summary' | 'player' | 'app'
  canonical?: string
  robots?: 'noindex' | 'nofollow' | 'noindex, nofollow'
  prev?: string
  next?: string
}

export const getMetadata = ({
  args,
  title,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  robots,
  prev,
  next,
  ...props
}: Props): MetaDescriptor[] => {
  const { matches, location } = args
  const matchData = matches.find((match) => {
    return match.id === 'root'
  })?.loaderData as Route.ComponentProps['loaderData'] | undefined
  const lang = matchData?.lang ?? LANG.JA
  const siteInfo = getSiteInfo({ lang })
  const { SITE_NAME, BASE_TITLE_NOTE, BASE_DESCRIPTION } = siteInfo
  const baseTitle = `${SITE_NAME} | ${BASE_TITLE_NOTE}`
  const titleText = title ? `${title} | ${SITE_NAME}` : baseTitle
  const description = props.description ?? BASE_DESCRIPTION
  const canonicalUrl = canonical ?? `${SITE_URL}${location.pathname}`
  const ogImageUrl = ogImage ?? `${SITE_URL}/assets/img/img-ogp.jpg`

  const metadata: MetaDescriptor[] = [
    {
      title: titleText,
    },
    {
      name: 'description',
      content: description,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: canonicalUrl,
    },
    {
      property: 'og:title',
      content: titleText,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:url',
      content: canonicalUrl,
    },
    {
      property: 'og:site_name',
      content: SITE_NAME,
    },
    {
      property: 'og:image',
      content: ogImageUrl,
    },
    {
      property: 'og:type',
      content: ogType,
    },
    {
      name: 'twitter:card',
      content: twitterCard,
    },
    {
      name: 'twitter:title',
      content: titleText,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: ogImageUrl,
    },
  ]

  if (process.env.NODE_ENV !== 'production' || NO_INDEX === 'true') {
    metadata.push({
      name: 'robots',
      content: 'noindex, nofollow',
    })
  } else if (robots) {
    metadata.push({
      name: 'robots',
      content: robots,
    })
  }

  if (prev) {
    metadata.push({
      tagName: 'link',
      rel: 'prev',
      href: prev,
    })
  }

  if (next) {
    metadata.push({
      tagName: 'link',
      rel: 'next',
      href: next,
    })
  }

  return metadata
}
