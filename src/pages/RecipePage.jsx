import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Badge, Button, ListGroup, Spinner, Alert, Ratio, Form } from 'react-bootstrap'

import { getMealById, getIngredients, toYoutubeEmbed } from '../api.js'

// SCREEN 2: everything about one recipe: photo, ingredients, steps and video.
// It also lets the user tick off ingredients as a shopping/cooking checklist
// and save the recipe to favourites.
export default function RecipePage({ isFavorite, onAdd, onRemove }) {
  const { id } = useParams() // the ":id" part of the URL /recipe/:id
  const navigate = useNavigate()

  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checked, setChecked] = useState([]) // ingredients the user has ticked off

  useEffect(() => {
    let ignore = false

    async function loadMeal() {
      setLoading(true)
      setError(null)
      setChecked([])
      try {
        const result = await getMealById(id)
        if (ignore) return
        if (result) setMeal(result)
        else setError('This recipe does not exist.')
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadMeal()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2 text-secondary">Loading recipe…</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        Could not load the recipe: {error}{' '}
        <Alert.Link onClick={() => navigate('/')}>Back to search</Alert.Link>
      </Alert>
    )
  }

  const ingredients = getIngredients(meal)
  const videoUrl = toYoutubeEmbed(meal.strYoutube)
  const saved = isFavorite(meal.idMeal)
  // Split the instructions into paragraphs wherever the text has line breaks.
  const steps = meal.strInstructions.split(/\r?\n/).filter((line) => line.trim() !== '')

  function toggleIngredient(name) {
    setChecked(checked.includes(name) ? checked.filter((n) => n !== name) : [...checked, name])
  }

  return (
    <>
      <Button variant="link" className="px-0 mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Row className="g-4">
        <Col lg={5}>
          <img src={meal.strMealThumb} alt={meal.strMeal} className="img-fluid rounded shadow-sm" />
        </Col>

        <Col lg={7}>
          <h1 className="fw-bold">{meal.strMeal}</h1>
          <div className="mb-3">
            <Badge bg="secondary" className="me-1">{meal.strCategory}</Badge>
            <Badge bg="light" text="dark" className="me-1">{meal.strArea}</Badge>
            {meal.strTags &&
              meal.strTags.split(',').filter(Boolean).map((tag) => (
                <Badge key={tag} bg="warning" text="dark" className="me-1">
                  {tag.trim()}
                </Badge>
              ))}
          </div>

          {saved ? (
            <Button variant="outline-danger" onClick={() => onRemove(meal.idMeal)}>
              ♥ Saved, remove from favourites
            </Button>
          ) : (
            <Button variant="danger" onClick={() => onAdd(meal)}>
              ♡ Save to favourites
            </Button>
          )}

          <h2 className="fs-4 mt-4">
            Ingredients{' '}
            <small className="text-secondary fs-6">
              ({checked.length}/{ingredients.length} ready)
            </small>
          </h2>
          <ListGroup>
            {ingredients.map(({ ingredient, measure }) => (
              <ListGroup.Item key={ingredient}>
                <Form.Check
                  id={`ing-${ingredient}`}
                  checked={checked.includes(ingredient)}
                  onChange={() => toggleIngredient(ingredient)}
                  label={
                    <span className={checked.includes(ingredient) ? 'text-decoration-line-through text-secondary' : ''}>
                      <strong>{measure}</strong> {ingredient}
                    </span>
                  }
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <h2 className="fs-4 mt-5">Instructions</h2>
      <div className="instructions">
        {steps.map((step, index) => (
          <p key={index}>{step}</p>
        ))}
      </div>

      {videoUrl && (
        <>
          <h2 className="fs-4 mt-4">Video</h2>
          <Ratio aspectRatio="16x9" className="mb-4" style={{ maxWidth: 720 }}>
            <iframe src={videoUrl} title={`${meal.strMeal} video`} allowFullScreen />
          </Ratio>
        </>
      )}

      {meal.strSource && (
        <p>
          <a href={meal.strSource} target="_blank" rel="noreferrer">
            Original recipe source ↗
          </a>
        </p>
      )}
    </>
  )
}
