// All communication with TheMealDB lives in this file.
// TheMealDB is a free REST API that returns JSON. "1" in the URL is its public test key,
// so no secret key is needed (important, because everything on GitHub Pages is public).
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Shared helper: fetch a URL, check the HTTP status, and return the parsed JSON.
async function getJson(url) {
  const response = await fetch(url)

  // fetch() only throws on network failure, so a 404 or 500 must be checked by hand.
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

// Search recipes by name, e.g. "pasta". Returns an array (empty if nothing matches).
export async function searchMeals(name) {
  const data = await getJson(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`)
  return data.meals ?? [] // the API returns { meals: null } when there are no results
}

// All recipes in one category, e.g. "Seafood". Each item only has id, name and image.
export async function getMealsByCategory(category) {
  const data = await getJson(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
  return data.meals ?? []
}

// The list of categories (Beef, Chicken, Dessert, ...).
export async function getCategories() {
  const data = await getJson(`${BASE_URL}/categories.php`)
  return data.categories ?? []
}

// One complete recipe by its id. Returns null if the id does not exist.
export async function getMealById(id) {
  const data = await getJson(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`)
  return data.meals ? data.meals[0] : null
}

// A random recipe, used by the "Surprise me" button.
export async function getRandomMeal() {
  const data = await getJson(`${BASE_URL}/random.php`)
  return data.meals[0]
}

// The API stores ingredients as 20 separate fields: strIngredient1..20 and strMeasure1..20.
// This turns them into a clean array like [{ ingredient: 'Eggs', measure: '2' }, ...].
export function getIngredients(meal) {
  const list = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim() !== '') {
      list.push({ ingredient: ingredient.trim(), measure: (measure ?? '').trim() })
    }
  }
  return list
}

// Turns a normal YouTube link (watch?v=ID) into the embeddable form (embed/ID).
export function toYoutubeEmbed(url) {
  if (!url) return null
  const match = url.match(/[?&]v=([^&]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}
