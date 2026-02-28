import { Outlet } from 'react-router'

import type { Route } from './+types/route'

import { getDrinksDetail } from '~/server/api/drinks.server'
export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const { drinkId } = params

  const drink = await getDrinksDetail({ id: drinkId })

  if (!drink.success) {
    throw new Response('', {
      status: drink.status ?? 500,
    })
  }

  return {
    drink: drink.data.details,
  }
}

export default function LayoutSG20_101() {
  return <Outlet />
}
