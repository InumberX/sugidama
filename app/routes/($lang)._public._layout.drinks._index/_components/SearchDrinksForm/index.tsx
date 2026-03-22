import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { TextButton } from '~/components/ui/buttons/TextButton'
import { FormSubSet } from '~/components/ui/forms/FormSubSet'
import { InputCheckbox, type InputCheckboxProps } from '~/components/ui/forms/InputCheckbox'
import { InputRadio, type InputRadioProps } from '~/components/ui/forms/InputRadio'
import { InputText, type InputTextProps } from '~/components/ui/forms/InputText'
import { SvgIcon } from '~/components/ui/icons/SvgIcon'
import { TransitionFade } from '~/components/ui/transitions/TransitionFade'

import * as styles from './style.css'

type SearchCondition = {
  name: string
  count: number
  checkbox?: InputCheckboxProps
  radio?: InputRadioProps
}

type SearchDrinksFormProps = {
  onReset?: () => void
  keyword: {
    keywordProps: InputTextProps
  }
  searchConditions: SearchCondition[]
}

const SearchConditionItem = ({
  panelId,
  isSelected,
  contentsId,
  name,
  count,
  checkbox,
  radio,
}: {
  panelId: string
  isSelected: boolean
  contentsId: string
} & SearchCondition) => {
  const [isShow, setIsShow] = useState(false)

  return (
    <div
      id={panelId}
      className={styles.searchDrinksConditionsContents_item}
      role="tabpanel"
      tabIndex={isSelected ? 0 : undefined}
      // TODO: jsx で until-found が使えるようになったら↓に変更する
      // hidden={isSelected ? undefined : 'until-found'}
      hidden={!isSelected}
    >
      <div className={styles.searchDrinksConditionsContents_contents}>
        <div className={styles.searchDrinksConditionsContentsHeader}>
          <div className={styles.searchDrinksConditionsContentsHeader_container}>
            <a
              href={`#${contentsId}`}
              className={styles.searchDrinksConditionsContentsHeaderButton}
              role="button"
              aria-expanded={isShow ? 'true' : 'false'}
              aria-controls={contentsId}
              onClick={(event) => {
                event.preventDefault()

                setIsShow(!isShow)
              }}
            >
              <span className={styles.searchDrinksConditionsContentsHeaderButton_container}>
                <span className={styles.searchDrinksConditionsContentsHeaderButton_contents}>
                  <span className={styles.searchDrinksConditionsContentsHeaderButton_text}>{name}</span>

                  <TransitionFade
                    isShow={count > 0}
                    motionTag="span"
                    className={styles.searchDrinksConditionsContentsHeaderButtonCount}
                  >
                    <i className={styles.searchDrinksConditionsContentsHeaderButtonCount_text}>
                      {count > 99 ? '99+' : count}
                    </i>
                  </TransitionFade>
                </span>

                <SvgIcon
                  variant="keyboardArrowDown"
                  className={styles.searchDrinksConditionsContentsHeaderButtonCount_arrow}
                />
              </span>
            </a>
          </div>
        </div>

        <div
          id={contentsId}
          className={[
            styles.searchDrinksConditionsContentsBody,
            isShow && styles.searchDrinksConditionsContentsBody__active,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={styles.searchDrinksConditionsContentsBody_container}>
            <div className={styles.searchDrinksConditionsContentsBody_contents}>
              {checkbox && <InputCheckbox {...checkbox} />}
              {radio && <InputRadio {...radio} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SearchDrinksForm = ({ onReset, keyword, searchConditions }: SearchDrinksFormProps) => {
  const { t: tPage } = useTranslation('pages/SG20_100')
  const [isShowConditions, setIsShowConditions] = useState(false)
  const [currentSearchCondition, setCurrentSearchCondition] = useState(0)

  return (
    <div className={styles.searchDrinksForm}>
      <div className={styles.searchDrinksForm_container}>
        <div className={styles.searchDrinksFormInputs}>
          <div className={styles.searchDrinksFormInputs_container}>
            <div className={styles.searchDrinksFormInputsHeader}>
              {onReset && (
                <div className={styles.searchDrinksFormInputsHeaderReset}>
                  <TextButton
                    buttonType="reset"
                    size="small"
                    color="sub"
                    leftElm={<SvgIcon variant="replay" className={styles.searchDrinksFormInputsHeaderReset_icon} />}
                    onClick={() => {
                      onReset()
                    }}
                  >
                    {tPage('searchDrinksForm.reset.label')}
                  </TextButton>
                </div>
              )}
            </div>
            <div className={styles.searchDrinksFormInputs_contents}>
              <div className={styles.searchDrinksFormKeyword}>
                <FormSubSet title={tPage('searchDrinksForm.keyword.title')} isFirst isLast>
                  <InputText {...keyword.keywordProps} />
                </FormSubSet>
              </div>
            </div>
            <div
              className={[styles.searchDrinksConditions, isShowConditions && styles.searchDrinksConditions__active]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.searchDrinksConditions_wrapper}>
                <div className={styles.searchDrinksConditions_container}>
                  <div className={styles.searchDrinksConditionsButtons}>
                    <ul className={styles.searchDrinksConditionsButtons_items} role="tablist">
                      {searchConditions.map((searchCondition, i) => {
                        const panelId = `search-conditions-contents-item-${i}`
                        const isSelected = currentSearchCondition === i

                        return (
                          <li key={i} className={styles.searchDrinksConditionsButtons_item} role="presentation">
                            <a
                              href={`#${panelId}`}
                              className={styles.searchDrinksConditionsButtons_button}
                              role="tab"
                              aria-selected={isSelected ? 'true' : 'false'}
                              aria-controls={panelId}
                              tabIndex={isSelected ? 0 : -1}
                              onClick={(event) => {
                                event.preventDefault()

                                setCurrentSearchCondition(i)
                              }}
                            >
                              <span className={styles.searchDrinksConditionsButtons_contents}>
                                <span className={styles.searchDrinksConditionsButtons_text}>
                                  {searchCondition.name}
                                </span>
                                <TransitionFade
                                  isShow={searchCondition.count > 0}
                                  motionTag="span"
                                  className={styles.searchDrinksConditionsButtonsCount}
                                >
                                  <i className={styles.searchDrinksConditionsButtonsCount_text}>
                                    {searchCondition.count > 99 ? '99+' : searchCondition.count}
                                  </i>
                                </TransitionFade>
                              </span>
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className={styles.searchDrinksConditionsContents}>
                    <div className={styles.searchDrinksConditionsContents_items}>
                      {searchConditions.map((searchCondition, i) => {
                        const panelId = `search-conditions-contents-item-${i}`
                        const contentsId = `search-conditions-contents-body-${i}`
                        const isSelected = currentSearchCondition === i

                        return (
                          <SearchConditionItem
                            key={i}
                            panelId={panelId}
                            contentsId={contentsId}
                            isSelected={isSelected}
                            {...searchCondition}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.searchDrinksSideBottom}>
          <div className={styles.searchDrinksSideBottom_items}>
            <div className={styles.searchDrinksSideBottom_item}>
              <BaseButton buttonType="submit" className={styles.searchDrinksSideBottom_button}>
                {tPage('searchDrinksForm.search.label')}
              </BaseButton>
            </div>
            <div
              className={[styles.searchDrinksSideBottom_item, styles.searchDrinksSideBottom_item__conditions]
                .filter(Boolean)
                .join(' ')}
            >
              <BaseButton
                className={styles.searchDrinksSideBottom_button}
                variant="outlined"
                onClick={() => {
                  setIsShowConditions(!isShowConditions)
                }}
              >
                {isShowConditions
                  ? tPage('searchDrinksForm.conditions.hide')
                  : tPage('searchDrinksForm.conditions.show')}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
