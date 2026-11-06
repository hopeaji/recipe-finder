import { Link } from 'react-router-dom'

// Shown for any address that does not match a route.
export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="fw-bold">Page not found</h1>
      <p className="text-secondary">This page does not exist.</p>
      <Link to="/">Back to search</Link>
    </div>
  )
}
