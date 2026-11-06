# 🍲 Recipe Finder

A React web application for finding recipes and keeping a personal list of favourites.
Search recipes by name, browse them by category, open a recipe to see its ingredients,
step-by-step instructions and cooking video, and save the ones you like.

**Live app:** https://YOUR-USERNAME.github.io/recipe-finder/
**Repository:** https://github.com/YOUR-USERNAME/recipe-finder

## Screens

| Screen | Route | What it does |
|---|---|---|
| Search | `/` | Search recipes by name, browse a category, or open a random recipe ("Surprise me") |
| Recipe details | `/recipe/:id` | Photo, ingredient checklist, instructions, YouTube video, save/remove favourite |
| Favourites | `/favorites` | Saved recipes (kept after reload), filter them, remove one or clear all |

## Technologies

- **React** (with Vite): component-based UI
- **React Router** (`react-router-dom`): navigation between the three screens
- **React Bootstrap** + **Bootstrap 5**: styling and ready-made components (navbar, cards, forms, modal, spinner)
- **react-hot-toast**: notification pop-ups when recipes are saved or removed
- **TheMealDB API** (https://www.themealdb.com/api.php): free REST API returning recipe data as JSON, called with `fetch` and `async/await`
- **localStorage**: keeps favourites in the browser between visits

## How to run the project

You need **Node.js 20.19+ or 22.12+** (check with `node -v`).

```bash
# 1. Install the dependencies (creates the node_modules folder)
npm install

# 2. Start the development server
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

Other commands:

```bash
npm run build     # build the production version into the dist/ folder
npm run preview   # preview the production build locally
npm run deploy    # build and publish the app to GitHub Pages (gh-pages branch)
```

## Deployment

The app is deployed to GitHub Pages with the `gh-pages` package. `npm run deploy` builds the
app and pushes the `dist/` folder to the `gh-pages` branch. In the repository go to
**Settings → Pages**, choose **Deploy from a branch**, branch **gh-pages**, folder **/(root)**.

The app uses `HashRouter` (URLs like `/#/favorites`) and `base: './'` in `vite.config.js`,
so it works on GitHub Pages without extra configuration and refreshing a page never gives a 404.

## Project structure

```
src/
├── main.jsx               Entry point: Bootstrap CSS, router and toast container
├── App.jsx                Routes + favourites state (shared by two screens)
├── api.js                 All requests to TheMealDB and data helpers
├── index.css              Small custom styles
├── components/
│   ├── NavBar.jsx         Top navigation with favourites counter
│   └── RecipeCard.jsx     Reusable recipe tile
└── pages/
    ├── SearchPage.jsx     Screen 1: search and browse
    ├── RecipePage.jsx     Screen 2: recipe details
    ├── FavoritesPage.jsx  Screen 3: saved recipes
    └── NotFoundPage.jsx   Unknown addresses
```
