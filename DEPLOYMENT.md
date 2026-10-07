# Interview deployment

FilmFinder can be deployed as two services:

- React/Vite frontend on Vercel
- Django API on Render

The demo backend intentionally uses SQLite. Render's filesystem is temporary,
so likes may reset after a restart or redeploy. This is acceptable for a
temporary interview demo.

## 1. Push the project to GitHub

Do not commit `.env`. Use `.env.example` as the template for local variables.

```powershell
git add .env.example render.yaml DEPLOYMENT.md requirements.txt backend/settings.py src/services/api.js src/pages/TopGenres.jsx
git commit -m "Prepare FilmFinder for hosted demo"
git push
```

## 2. Deploy the Django API on Render

Create a Render Web Service from the GitHub repository. The included
`render.yaml` supplies these commands:

```text
Build: pip install -r requirements.txt && python manage.py migrate
Start: gunicorn backend.wsgi:application
```

After creating the service, set:

```text
DJANGO_ALLOWED_HOSTS=your-service.onrender.com
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

The generated `DJANGO_SECRET_KEY` and `DJANGO_DEBUG=False` are supplied by
`render.yaml`. Copy the deployed Render URL.

## 3. Deploy the frontend on Vercel

Import the same GitHub repository into Vercel. Use:

```text
Build command: npm run build
Output directory: dist
```

Add these Vercel environment variables:

```text
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_BACKEND_URL=https://your-service.onrender.com
```

Deploy the frontend and copy its Vercel URL.

## 4. Finish CORS configuration

Return to Render and set `CORS_ALLOWED_ORIGINS` to the exact Vercel URL, with
no trailing slash. Redeploy the API.

## 5. Test the hosted demo

Verify browsing, search, likes, the Likes page, and Movie Wrapped. The
frontend uses TMDB directly; Movie Wrapped uses the hosted Django API.
