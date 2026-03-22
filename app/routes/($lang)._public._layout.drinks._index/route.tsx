import { useForm, getFormProps, getInputProps, getCollectionProps } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { type MetaFunction, useNavigation, useSearchParams, useNavigate } from 'react-router'
import { z } from 'zod'

import { Form } from '~/components/ui/forms/Form'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { PageTitle } from '~/components/ui/typographies/PageTitle'
import { PAGES } from '~/config/paths'
import { getDrinks } from '~/server/api/drinks.server'
import { convertError } from '~/server/api/error.server'
import { getTagTaste } from '~/server/api/tags.server'
import { convertDrinksToArticleCardProps } from '~/utils/article'
import { parseNumberParam } from '~/utils/loader-guards.server'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'
import { preprocessSearchKeyword } from '~/utils/search'
import { convertTags } from '~/utils/tags'

import { SearchDrinksForm } from './_components/SearchDrinksForm'
import { SearchDrinksResult, type SearchDrinksResultData } from './_components/SearchDrinksResult'
import * as styles from './style.css'

import type { Route } from './+types/route'

const page = PAGES.SG20_100

const searchDrinksSchema = z.object({
  keyword: z.string().trim().optional(),
  taste: z.array(z.string().trim()).optional(),
  page: z.string().optional(),
})

type SearchDrinksSchema = z.infer<typeof searchDrinksSchema>

export const meta: MetaFunction = (args) => {
  const { params } = args
  const lang = getLang({
    lang: params.lang,
  })

  return getMetadata({
    args,
    title: page.getName({
      lang,
    }),
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params, request } = args
  const lang = getLang(params)
  const url = new URL(request.url)
  const currentPage = parseNumberParam(url.searchParams.get('page') ?? '1', 'page')
  const submit = parseWithZod(url.searchParams, {
    schema: searchDrinksSchema,
  })

  if (submit.status === 'success') {
    submit.value.keyword = preprocessSearchKeyword(submit.value.keyword)
  }

  const [tagTasteResult] = await Promise.all([getTagTaste()])

  if (!tagTasteResult.success) {
    throw convertError(tagTasteResult)
  }

  const tagTaste = convertTags({
    lang,
    tagItems: tagTasteResult.data.list,
  })

  const drinks: Promise<SearchDrinksResultData> = getDrinks({
    page: currentPage,
    ...(submit.status === 'success' && {
      keyword: submit.value.keyword,
      tags: [
        ...(submit.value.taste
          ? submit.value.taste
              .map((taste) => parseInt(taste, 10))
              .filter((n) => !isNaN(n))
          : []),
      ],
    }),
  }).then((res) => {
    if (!res.success) {
      return {
        success: false,
        error: res.message,
        drinks: [],
        totalSize: 0,
      }
    }

    return {
      success: true,
      drinks: res.data.list.map((drink) =>
        convertDrinksToArticleCardProps({
          lang,
          drink,
          tags: [
            {
              name: 'taste',
              items: [...tagTaste],
            },
          ],
        })
      ),
      totalSize: res.data.pageInfo.totalCnt,
    }
  })

  return {
    lang,
    currentPage,
    drinks,
    submitValue: submit.status === 'success' ? submit.value : undefined,
    tagTaste,
  }
}

export default function PageSG20_100({ loaderData }: Route.ComponentProps) {
  const { lang, currentPage, submitValue, tagTaste } = loaderData
  const drinks = loaderData.drinks as Promise<SearchDrinksResultData>
  const navigation = useNavigation()
  const navigate = useNavigate()
  const { t: tPage } = useTranslation('pages/SG20_100')
  const [searchParams] = useSearchParams()
  const pageName = page.getName({
    lang,
  })
  const refSearchDrinksSideForm = useRef<HTMLFormElement>(null)
  const [form, fields] = useForm<SearchDrinksSchema, SearchDrinksSchema>({
    id: `search-drinks-form-${lang}-${searchParams.toString()}`,
    constraint: getZodConstraint(searchDrinksSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: searchDrinksSchema,
      })
    },
    defaultValue: {
      keyword: submitValue?.keyword ? preprocessSearchKeyword(submitValue.keyword) : '',
      taste: submitValue?.taste ?? [],
      page: String(currentPage ?? 1),
    },
  })

  const handleSubmitSearch = (newPage?: number) => {
    form.update({
      name: fields.page.name,
      value: newPage ? String(newPage) : '1',
    })

    setTimeout(() => {
      refSearchDrinksSideForm.current?.requestSubmit()
    }, 100)
  }

  return (
    <LayoutPageWrapper>
      <PageTitle title={pageName} color="primary" isWrap />
      <div className={styles.drinks}>
        <LayoutInner>
          <div className={styles.drinks_container}>
            <div className={styles.drinks_side}>
              <Form method="get" {...getFormProps(form)} ref={refSearchDrinksSideForm} preventScrollReset>
                <input
                  {...getInputProps(fields.page, {
                    type: 'hidden',
                  })}
                  key={fields.page.key}
                />
                <SearchDrinksForm
                  onReset={() => {
                    navigate(
                      page.getUrl({
                        lang,
                      }),
                      {
                        preventScrollReset: true,
                      }
                    )
                  }}
                  keyword={{
                    keywordProps: {
                      errors: fields.keyword.errors,
                      inputProps: getInputProps(fields.keyword, {
                        type: 'text',
                      }),
                      placeholder: tPage('searchDrinksForm.keyword.placeholder'),
                    },
                  }}
                  searchConditions={[
                    {
                      name: tPage('searchDrinksForm.conditions.taste.name'),
                      count: Array.isArray(fields.taste.value)
                        ? fields.taste.value.length
                        : (fields.taste.value && 1) || 0,
                      checkbox: {
                        errors: fields.taste.errors,
                        inputProps: getCollectionProps(fields.taste, {
                          type: 'checkbox',
                          options: tagTaste.map((tag) => String(tag.id)),
                        }),
                        labels: tagTaste.map((tag) => tag.label),
                      },
                    },
                  ]}
                />
              </Form>
            </div>
            <div className={styles.drinks_result}>
              <SearchDrinksResult
                lang={lang}
                isLoading={navigation.state === 'loading'}
                currentPage={currentPage}
                searchResult={drinks}
                handleChangePage={(newPage) => {
                  handleSubmitSearch(newPage)
                }}
              />
            </div>
          </div>
        </LayoutInner>
      </div>
    </LayoutPageWrapper>
  )
}
