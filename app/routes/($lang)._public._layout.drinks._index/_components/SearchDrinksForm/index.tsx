import { useTranslation } from 'react-i18next'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { TextButton } from '~/components/ui/buttons/TextButton'
import { FormSubSet } from '~/components/ui/forms/FormSubSet'
import { InputText, type InputTextProps } from '~/components/ui/forms/InputText'
import { SvgIcon } from '~/components/ui/icons/SvgIcon'

import * as styles from './style.css'

type SearchDrinksFormProps = {
  onReset?: () => void
  keyword: {
    keywordProps: InputTextProps
  }
}

export const SearchDrinksForm = ({ onReset, keyword }: SearchDrinksFormProps) => {
  const { t: tPage } = useTranslation('pages/SG20_100')
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
          </div>
        </div>
        <div className={styles.searchProjectsSideBottom}>
          <div className={styles.searchProjectsSideBottom_items}>
            <div className={styles.searchProjectsSideBottom_item}>
              <BaseButton buttonType="submit" className={styles.searchProjectsSideBottom_button}>
                {tPage('searchDrinksForm.search.label')}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
