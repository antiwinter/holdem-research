import { useSyncExternalStore } from 'react'
import { getCards, subscribe } from './store'

export function useCards() {
  return useSyncExternalStore(subscribe, getCards)
}
