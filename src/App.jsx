import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import toast from 'react-hot-toast'

import NavBar from './components/NavBar.jsx'
import SearchPage from './pages/SearchPage.jsx'
import RecipePage from './pages/RecipePage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const STORAGE_KEY = 'recipe-finder-favorites'

// Read saved favourites once, when the app starts. Falls back to [] if nothing is saved
// or the saved text is broken.
function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export default function App() {
  // Favourites are used by two screens (recipe details and favourites), so the state
  // lives here in their common parent and is passed down as props.
  const [favorites, setFavorites] = useState(loadFavorites)

  // Side effect: every time favourites change, save them to the browser's localStorage
  // so they are still there after a page reload.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function isFavorite(id) {
    return favorites.some((meal) => meal.idMeal === id)
  }

  function addFavorite(meal) {
    if (isFavorite(meal.idMeal)) return
    // Only the fields the favourites screen needs are stored.
    const saved = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
    }
    setFavorites([...favorites, saved])
    toast.success(`Saved "${meal.strMeal}" to favourites`)
  }

  function removeFavorite(id) {
    const meal = favorites.find((m) => m.idMeal === id)
    setFavorites(favorites.filter((m) => m.idMeal !== id))
    if (meal) toast(`Removed "${meal.strMeal}"`, { icon: '🗑️' })
  }

  function clearFavorites() {
    setFavorites([])
    toast('All favourites cleared', { icon: '🧹' })
  }

  return (
    <>
      <NavBar favoriteCount={favorites.length} />
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route
            path="/recipe/:id"
            element={
              <RecipePage
                isFavorite={isFavorite}
                onAdd={addFavorite}
                onRemove={removeFavorite}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onRemove={removeFavorite}
                onClear={clearFavorites}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  )
}
