import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Row, Col, Spinner, Alert, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'

import RecipeCard from '../components/RecipeCard.jsx'
import { searchMeals, getMealsByCategory, getCategories, getRandomMeal } from '../api.js'

const DEFAULT_CATEGORY = 'Seafood'

// SCREEN 1: find recipes by name or browse a category.
export default function SearchPage() {
  // The current search lives in the URL (?q=pasta or ?c=Dessert). That way the results are
  // still there when the user opens a recipe and presses the browser's Back button.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('c') ?? (query ? '' : DEFAULT_CATEGORY)

  const [text, setText] = useState(query) // controlled input: what is typed in the box
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Keep the text box in step with the URL (e.g. after pressing the browser's Back button).
  useEffect(() => {
    setText(query)
  }, [query])

  // Load the category list once, when the screen first appears (empty dependency array).
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([])) // the dropdown is optional, so fail quietly
  }, [])

  // Load the results whenever the search text or the category in the URL changes.
  useEffect(() => {
    let ignore = false // protects against an older, slower request overwriting a newer one

    async function loadMeals() {
      setLoading(true)
      setError(null)
      try {
        const result = query ? await searchMeals(query) : await getMealsByCategory(category)
        if (!ignore) setMeals(result)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadMeals()
    return () => {
      ignore = true // cleanup: runs before the next request starts
    }
  }, [query, category])

  function handleSubmit(event) {
    event.preventDefault() // stop the browser from reloading the page
    const trimmed = text.trim()
    if (trimmed === '') {
      toast.error('Type a recipe name first')
      return
    }
    setSearchParams({ q: trimmed })
  }

  function handleCategoryChange(event) {
    setText('')
    setSearchParams({ c: event.target.value })
  }

  async function handleSurprise() {
    try {
      const meal = await getRandomMeal()
      navigate(`/recipe/${meal.idMeal}`)
    } catch {
      toast.error('Could not load a random recipe. Please try again.')
    }
  }

  const heading = query ? `Results for "${query}"` : `${category} recipes`

  return (
    <>
      <div className="mb-4">
        <h1 className="fw-bold">What would you like to cook?</h1>
        <p className="text-secondary mb-0">
          Search hundreds of recipes from around the world, or browse a category.
        </p>
      </div>

      <Row className="g-2 mb-4">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="e.g. pasta, curry, pancakes"
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-label="Recipe name"
              />
              <Button type="submit" variant="warning">
                Search
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={3}>
          <Form.Select
            value={query ? '' : category}
            onChange={handleCategoryChange}
            aria-label="Browse by category"
          >
            <option value="" disabled>
              Browse by category
            </option>
            {categories.map((c) => (
              <option key={c.idCategory} value={c.strCategory}>
                {c.strCategory}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="d-grid">
          <Button variant="outline-dark" onClick={handleSurprise}>
            🎲 Surprise me
          </Button>
        </Col>
      </Row>

      <h2 className="fs-4 mb-3">{heading}</h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2 text-secondary">Loading recipes…</p>
        </div>
      )}

      {!loading && error && (
        <Alert variant="danger">Something went wrong while loading recipes: {error}</Alert>
      )}

      {!loading && !error && meals.length === 0 && (
        <Alert variant="info">No recipes found. Try another word, such as "chicken".</Alert>
      )}

      {!loading && !error && meals.length > 0 && (
        <>
          <p className="text-secondary">
            {meals.length} {meals.length === 1 ? 'recipe' : 'recipes'}
          </p>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {meals.map((meal) => (
              <Col key={meal.idMeal}>
                <RecipeCard meal={meal} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  )
}
