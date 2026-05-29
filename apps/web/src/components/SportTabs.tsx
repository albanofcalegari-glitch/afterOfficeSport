import type { Sport } from '../types'
import { sportTabs } from '../data/options'

interface SportTabsProps {
  activeSport: Sport
  activeMode: string
  onSelect: (sport: Sport, mode: string) => void
}

export default function SportTabs({ activeSport, activeMode, onSelect }: SportTabsProps) {
  return (
    <div className="tabs" aria-label="Menú de deportes">
      {sportTabs.map(tab => {
        const isActive = tab.sport === activeSport && tab.mode === activeMode
        return (
          <button
            key={`${tab.sport}-${tab.mode}`}
            className={`tab${isActive ? ' active' : ''}`}
            onClick={() => onSelect(tab.sport, tab.mode)}
          >
            {tab.label}
            <span>{tab.sub}</span>
          </button>
        )
      })}
    </div>
  )
}
