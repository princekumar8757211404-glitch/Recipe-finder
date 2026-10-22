 import { useState, useEffect } from 'react'
import './App.css'

const API = 'https://www.themealdb.com/api/json/v1/1'

function App() {
  const [search, setSearch] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [error, setError] = useState('')

  async function searchRecipes(query) {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API}/search.php?s=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        throw new Error('Unable to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data.meals || [])

      if (!data.meals) {
        setError('No recipes found. Try searching for chicken or pasta.')
      }
    } catch {
      setRecipes([])
      setError('Network error. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchRecipes('chicken')
  }, [])

  function getIngredients(recipe) {
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]?.trim()
      const measure = recipe[`strMeasure${i}`]?.trim()

      if (ingredient) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim())
      }
    }

    return ingredients
  }

  return (
    <div className="app">
      <header className="navbar">
        <h2>🍳 Recipe Finder</h2>
        <span>Discover • Cook • Enjoy</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR DAILY COOKING INSPIRATION</p>
        <h1>Find Your Perfect Recipe</h1>
        <p>Explore delicious dishes from around the world.</p>

        <form
          className="search-box"
          onSubmit={(e) => {
            e.preventDefault()
            if (search.trim()) searchRecipes(search.trim())
          }}
        >
          <input
            type="text"
            placeholder="Search chicken, pasta, curry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        <div className="quick-search">
          <span>Popular:</span>
          {['Chicken', 'Pasta', 'Cake', 'Curry'].map((item) => (
            <button
              className="tag"
              key={item}
              onClick={() => {
                setSearch(item)
                searchRecipes(item)
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <main className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HANDPICKED FOR YOU</p>
            <h2>Explore Recipes 🍽️</h2>
          </div>
          <span>{recipes.length} recipes found</span>
        </div>

        {loading && <p className="message">Finding delicious recipes...</p>}

        {!loading && error && <p className="message">{error}</p>}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <article className="recipe-card" key={recipe.idMeal}>
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                loading="lazy"
              />

              <div className="card-content">
                <span className="category">
                  {recipe.strCategory || 'Delicious Food'}
                </span>

                <h3>{recipe.strMeal}</h3>

                <p>🌍 {recipe.strArea || 'International'} cuisine</p>

                <button
                  className="view-button"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  View Recipe →
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {selectedRecipe && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedRecipe(null)}
        >
          <section
            className="recipe-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedRecipe.strMeal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close recipe"
            >
              ✕
            </button>

            <img
              className="modal-image"
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
            />

            <div className="modal-content">
              <h2>{selectedRecipe.strMeal}</h2>

              <p>
                {selectedRecipe.strArea || 'International'} cuisine
                {' • '}
                {selectedRecipe.strCategory || 'Main Dish'}
              </p>

              <h3>Ingredients</h3>

              <ul>
                {getIngredients(selectedRecipe).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>

              <h3>Cooking Instructions</h3>

              <p className="instructions">
                {selectedRecipe.strInstructions ||
                  'Instructions are not available for this recipe.'}
              </p>

              {selectedRecipe.strYoutube && (
                <a
                  className="video-link"
                  href={selectedRecipe.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Cooking Video ↗
                </a>
              )}
            </div>
          </section>
        </div>
      )}

      <footer>
        <p>© 2026 Recipe Finder | Built with React ❤️</p>
        <p>Recipe data provided by TheMealDB.</p>
      </footer>
    </div>
  )
}

export default App