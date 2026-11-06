import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Alert, Form, Modal } from 'react-bootstrap'

import RecipeCard from '../components/RecipeCard.jsx'

// SCREEN 3: the user's saved recipes (kept in localStorage by App.jsx).
// Features: filter the saved list by name or category, remove one, or clear all.
export default function FavoritesPage({ favorites, onRemove, onClear }) {
  const [filter, setFilter] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  if (favorites.length === 0) {
    return (
      <>
        <h1 className="fw-bold mb-3">My favourites</h1>
        <Alert variant="light" className="border">
          You have not saved any recipes yet. <Link to="/">Find a recipe</Link> and press
          "Save to favourites".
        </Alert>
      </>
    )
  }

  // Derived data: computed from props + state on every render, so it is never out of date.
  const term = filter.trim().toLowerCase()
  const shown = favorites.filter(
    (meal) =>
      meal.strMeal.toLowerCase().includes(term) ||
      (meal.strCategory ?? '').toLowerCase().includes(term)
  )

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="fw-bold mb-0">My favourites ({favorites.length})</h1>
        <Button variant="outline-secondary" size="sm" onClick={() => setShowConfirm(true)}>
          Clear all
        </Button>
      </div>

      <Form.Control
        className="mb-4"
        style={{ maxWidth: 360 }}
        placeholder="Filter saved recipes by name or category"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filter favourites"
      />

      {shown.length === 0 ? (
        <Alert variant="info">No saved recipe matches "{filter}".</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {shown.map((meal) => (
            <Col key={meal.idMeal}>
              <RecipeCard meal={meal}>
                <Button variant="outline-danger" size="sm" onClick={() => onRemove(meal.idMeal)}>
                  Remove
                </Button>
              </RecipeCard>
            </Col>
          ))}
        </Row>
      )}

      {/* React Bootstrap modal: asks before deleting everything. */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear all favourites?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This removes all {favorites.length} saved recipes.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onClear()
              setShowConfirm(false)
            }}
          >
            Clear all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
