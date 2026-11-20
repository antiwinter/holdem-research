import { useEffect } from 'react'

export type KeyBindings = Record<string, (e: KeyboardEvent) => void>

// Descriptor: alt('|' alt)* where alt = ['mod+'] key, keys lowercase e.key (' ', 'arrowup').
// 'mod+' binds meta/ctrl combos; a plain key only matches with no meta/ctrl held.
// Repeats ignored; matched keys preventDefault.
export function useKeys(bindings: KeyBindings): void {
  useEffect(() => {
    const matchers = Object.entries(bindings).map(([descriptor, handler]) => ({
      handler,
      alts: descriptor.split('|').map((alt) => ({
        key: alt.replace(/^mod\+/, ''),
        mod: alt.startsWith('mod+'),
      })),
    }))
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      const mod = e.metaKey || e.ctrlKey
      const m = matchers.find(({ alts }) => alts.some((a) => a.key === key && a.mod === mod))
      if (!m) return
      e.preventDefault()
      m.handler(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
}
