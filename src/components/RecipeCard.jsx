import { Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// One recipe tile, reused on the search screen and the favourites screen.
// `children` lets a parent add extra buttons under the card (e.g. "Remove").
export default function RecipeCard({ meal, children }) {
  return (
    <Card className="recipe-card h-100">
      <Link to={`/recipe/${meal.idMeal}`}>
        <Card.Img variant="top" src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h2" className="fs-6">
          <Link to={`/recipe/${meal.idMeal}`} className="text-dark text-decoration-none">
            {meal.strMeal}
          </Link>
        </Card.Title>
        {(meal.strCategory || meal.strArea) && (
          <div className="mb-2">
            {meal.strCategory && <Badge bg="secondary" className="me-1">{meal.strCategory}</Badge>}
            {meal.strArea && <Badge bg="light" text="dark">{meal.strArea}</Badge>}
          </div>
        )}
        <div className="mt-auto">{children}</div>
      </Card.Body>
    </Card>
  )
}
