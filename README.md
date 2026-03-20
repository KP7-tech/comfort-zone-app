## 🚀 Deployment

This project is configured for automatic deployment to **GitHub Pages** using GitHub Actions.

### Setting up GitHub Pages

1. Go to your GitHub Repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Branch**, ensure it is NOT set to "GitHub Actions" (unless you prefer that, but our workflow uses the `gh-pages` branch).
3. The provided Action will automatically create and update the `gh-pages` branch.

### Environment Variables & Secrets

The application requires API keys for Gemini or OpenAI. Since the backend proxy (`server/server.js`) cannot run on GitHub Pages, you have two options:

#### Option A: Use a Remote Backend (Recommended)
1. Deploy the `server/` folder to a service like **Render**, **Fly.io**, or **Vercel**.
2. In your hosting service, set the environment variables found in `server/.env.example`:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
3. In your GitHub Repository **Settings** > **Secrets and variables** > **Actions**, add a new secret:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.render.com`).

#### Option B: Client-side Keys (Manual)
Users can enter their own API keys directly in the application UI. These keys are stored in `localStorage` and used for direct API calls, bypassing the need for a backend.

### Automatic Deployment
Every push to the `main` branch will trigger the GitHub Action defined in `.github/workflows/deploy.yml`, which builds the frontend and deploys it to GitHub Pages.
