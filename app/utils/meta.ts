import type { MetaDescriptor } from '@remix-run/node'
import type { ServerRuntimeMetaArgs, SerializeFrom } from '@remix-run/server-runtime'
import type { loader as rootLoader } from '~/root'

type Props = {
  args: ServerRuntimeMetaArgs
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

export const siteName = 'Sugidama'
export const baseTitle = `${siteName} | お酒の銘柄、製造元、味わいを紹介`
export const baseDescription =
  'このサイトでは、管理人がこれまで飲んできた美味しいお酒を独断と偏見で記録しています。銘柄、製造元、味わいの特徴を紹介し、気になるお酒があれば販売サイトもご覧いただけます。'

export const getMetadata = ({
  args,
  title,
  description = baseDescription,
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
  })?.data as SerializeFrom<typeof rootLoader>
  const env = matchData.env
  const { NO_INDEX, SITE_URL } = env
  const titleText = title ? `${title} | ${siteName}` : baseTitle
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
      content: siteName,
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