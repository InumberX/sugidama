import type { MetaDescriptor } from 'react-router'
import type { MetaArgs } from 'react-router'

import type { Route } from '~/+types/root'
import { NO_INDEX, SITE_URL, SITE_NAME } from '~/config/env'

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

const baseSettings: {
  [key: string]: {
    description: string
    titleNote: string
  }
} = {
  ja: {
    description:
      'このサイトでは、管理人がこれまで飲んできた美味しいお酒を独断と偏見で記録しています。銘柄、製造元、味わいの特徴を紹介し、気になるお酒があれば販売サイトもご覧いただけます。',
    titleNote: 'お酒の銘柄、製造元、味わいを紹介',
  },
  en: {
    description:
      'This site records the delicious sake I have drunk so far, based on my own judgment and prejudice. It introduces brands, manufacturers, and characteristics of sake, and if you are interested in a particular sake, you can also view the sales site.',
    titleNote: 'Brand, Manufacturer, and Taste of Sake',
  },
}

export const getMetadata = ({
  args,
  title,
  description,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonical,
  robots,
  prev,
  next,
}: Props): MetaDescriptor[] => {
  const { matches, location } = args
  const matchData = matches.find((match) => {
    return match.id === 'root'
  })?.data as Route.ComponentProps['loaderData']
  const lang = matchData.lang
  const baseSetting = baseSettings[lang]
  const baseTitle = `${SITE_NAME} | ${baseSetting.titleNote}`
  const titleText = title ? `${title} | ${SITE_NAME}` : baseTitle
  const outputDescription = description ?? baseSetting.description
  const canonicalUrl = canonical ?? `${SITE_URL}${location.pathname}`
  const ogImageUrl = ogImage ?? `${SITE_URL}/assets/img/img-ogp.jpg`

  const metadata: MetaDescriptor[] = [
    {
      title: titleText,
    },
    {
      name: 'description',
      content: outputDescription,
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
      content: outputDescription,
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
      content: outputDescription,
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
