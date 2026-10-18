// Ported from develop: SearchDrinksForm and the search form of
// app/routes/($lang)._public._layout.drinks._index. A client entry: the
// conditions switch between tabs (below md) and an accordion (md and up), the
// counts follow the checkboxes, and "Add conditions" folds them on small
// screens. The search itself is a plain GET form, so it submits without
// JavaScript too.
import { clientEntry, css, on, ref, type Handle, type RemixNode } from 'remix/component'

import { BaseButton } from '../../../../../../ui/buttons/public/base-button/base-button.tsx'
import { TextButton } from '../../../../../../ui/buttons/public/text-button/text-button.tsx'
import { SvgIcon } from '../../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import { clientModuleUrl } from '../../../../../../ui/public/client-module-url.ts'
import { BaseAccordion } from '../base-accordion/base-accordion.tsx'
import { BaseTabs } from '../base-tabs/base-tabs.tsx'
import { FormSubSet } from '../form-sub-set/form-sub-set.tsx'
import { InputCheckbox } from '../input-checkbox/input-checkbox.tsx'
import { InputText } from '../input-text/input-text.tsx'
import * as styles from './search-drinks-form.styles.ts'
import type { SearchDrinksCondition, SearchDrinksFormProps } from './search-drinks-form.types.ts'

export type * from './search-drinks-form.types.ts'

const KEYWORD_ID = 'search-drinks-keyword'
const CONDITIONS_ID = 'search-drinks-conditions'
const ACCORDION_ID = 'search-drinks-accordion'

/** develop capped the count at two digits. */
const formatCount = (count: number): string => (count > 99 ? '99+' : String(count))

export const SearchDrinksForm = clientEntry(
  clientModuleUrl(
    'app/actions/drinks/index-page/public/components/search-drinks-form/search-drinks-form.tsx'
  ),
  function SearchDrinksForm(handle: Handle<SearchDrinksFormProps>) {
    // The checked values per condition, kept here so the counts follow them and
    // nothing is lost when the layout swaps tabs for the accordion. Seeded from
    // the server's HTML when there is one: the conditions are <details>, usable
    // before the client entry hydrates, and whatever was ticked by then (or
    // restored by the browser on Back) would otherwise be reset by hydration,
    // which writes `checked` from these values. Setup runs before that write.
    const ticked = (name: string, fallback: string[]) => {
      const container =
        typeof document === 'undefined' ? null : document.getElementById(CONDITIONS_ID)
      if (container === null) return fallback
      return [
        ...container.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${name}"]`),
      ]
        .filter((input) => input.checked)
        .map((input) => input.value)
    }
    const selected = new Map(
      handle.props.conditions.map((condition) => [
        condition.name,
        ticked(condition.name, [...condition.selected]),
      ])
    )
    let isOpen = false
    // The server cannot measure, so it renders the wide layout; the browser
    // corrects it once it can read the container query (WIDE_PROPERTY).
    let isWide = true

    const toggle = (name: SearchDrinksCondition['name'], value: string, checked: boolean) => {
      const values = (selected.get(name) ?? []).filter((v) => v !== value)
      selected.set(name, checked ? [...values, value] : values)
      void handle.update()
    }

    const watchLayout = ref((node: HTMLElement, signal: AbortSignal) => {
      const measure = () => {
        const wide = getComputedStyle(node).getPropertyValue(styles.WIDE_PROPERTY).trim() === '1'
        if (wide === isWide) return
        isWide = wide
        void handle.update()
      }
      const observer = new ResizeObserver(measure)
      observer.observe(node)
      signal.addEventListener('abort', () => observer.disconnect())
      measure()
    })

    return () => {
      const { action, resetHref, keyword, conditions, messages } = handle.props
      const items = conditions.map((condition) => {
        const values = selected.get(condition.name) ?? []
        const label: RemixNode = (
          <>
            {condition.label}
            {values.length > 0 && (
              <>
                <i aria-hidden="true" mix={css(styles.searchDrinksConditionCount)}>
                  {formatCount(values.length)}
                </i>
                <span mix={css(styles.searchDrinksConditionCount_label)}>
                  {messages.selectedCount.before}
                  {values.length}
                  {messages.selectedCount.after}
                </span>
              </>
            )}
          </>
        )

        return {
          value: condition.name,
          label,
          content: (
            <div mix={css(styles.searchDrinksConditions_contents)}>
              <InputCheckbox
                name={condition.name}
                label={condition.label}
                options={condition.options}
                values={values}
                onToggle={(value, checked) => toggle(condition.name, value, checked)}
              />
            </div>
          ),
        }
      })
      return (
        <form action={action} method="get" mix={[css(styles.searchDrinksForm), watchLayout]}>
          <div mix={css(styles.searchDrinksFormInputs)}>
            <div mix={css(styles.searchDrinksFormReset)}>
              <TextButton
                url={resetHref}
                size="small"
                color="sub"
                leftElm={
                  <SvgIcon variant="replay" styleOverrides={styles.searchDrinksFormReset_icon} />
                }
              >
                {messages.reset}
              </TextButton>
            </div>

            <FormSubSet title={messages.keywordTitle} htmlFor={KEYWORD_ID} isFirst isLast>
              <InputText
                id={KEYWORD_ID}
                name="keyword"
                defaultValue={keyword}
                placeholder={messages.keywordPlaceholder}
              />
            </FormSubSet>

            <div
              id={CONDITIONS_ID}
              mix={css({
                ...styles.searchDrinksConditions,
                ...(isOpen ? styles.searchDrinksConditions__open : null),
              })}
            >
              <div mix={css(styles.searchDrinksConditions_wrapper)}>
                <div mix={css(styles.searchDrinksConditions_container)}>
                  {isWide ? (
                    <BaseAccordion id={ACCORDION_ID} items={items} />
                  ) : (
                    <BaseTabs label={messages.conditionsLabel} items={items} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div mix={css(styles.searchDrinksFormBottom)}>
            <BaseButton buttonType="submit" styleOverrides={styles.searchDrinksFormBottom_button}>
              {messages.search}
            </BaseButton>
            <div mix={css(styles.searchDrinksFormBottom_toggle)}>
              <BaseButton
                buttonType="button"
                variant="outlined"
                ariaControls={CONDITIONS_ID}
                ariaExpanded={isOpen}
                styleOverrides={styles.searchDrinksFormBottom_button}
                mix={on('click', () => {
                  isOpen = !isOpen
                  void handle.update()
                })}
              >
                {isOpen ? messages.hideConditions : messages.showConditions}
              </BaseButton>
            </div>
          </div>
        </form>
      )
    }
  }
)
