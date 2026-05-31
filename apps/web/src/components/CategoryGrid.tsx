import type { Sport, Mode } from '../types'
import { footballCategories, padelCategories, tennisCategories, kartingCategories, displayMode, getSportIcon } from '../data/options'

interface CategoryGridProps {
  sport: Sport
  mode: string
  onSelectCategory?: (sport: Sport, mode: string, category: string) => void
}

export default function CategoryGrid({ sport, mode, onSelectCategory }: CategoryGridProps) {
  const categoriesMap = { futbol: footballCategories, padel: padelCategories, tenis: tennisCategories, karting: kartingCategories }
  const categories = categoriesMap[sport]
  const icon = getSportIcon(sport)

  function handleClick(categoryTitle: string) {
    if (onSelectCategory) {
      onSelectCategory(sport, mode, categoryTitle)
    }
  }

  return (
    <div className="category-grid">
      {categories.map(item => (
        <article
          key={item.title}
          className={`category-card${onSelectCategory ? ' category-card-clickable' : ''}`}
          onClick={() => handleClick(item.title)}
        >
          <div>
            <h3>{icon} {item.title}</h3>
            <p>{item.desc}</p>
          </div>
          <div>
            <div className="category-meta">
              <span className="tag">{displayMode(mode as Mode)}</span>
              {item.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            {onSelectCategory && (
              <div className="category-cta">Inscribir equipo →</div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
