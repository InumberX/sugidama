import { Outlet } from 'react-router'

import { getDrinksDetail } from '~/server/api/drinks.server'
import { convertError } from '~/server/api/error.server'

import type { Route } from './+types/route'

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const { drinkId } = params

  const drink = await getDrinksDetail({ id: drinkId })

  if (!drink.success) {
    throw convertError(drink)
  }

  return {
    drink: drink.data.details,
  }
}

export default function LayoutSG20_101() {
  return <Outlet />
}
