# SWYNEX Frontend Integration — AdMaster

This repository contains the React + TypeScript frontend source recovered from the provided `full_project.md` export, including the existing API requests in the source.

## Task 3 goal
Connect the UI to the backend API and make asynchronous requests show loading, empty, success, and error feedback. The frontend source references a local API at `http://localhost:5000`. Confirm the matching backend routes before considering the integration complete.

## Run the frontend
1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown by Vite.

## Backend required
The frontend expects the backend API at `http://localhost:5000`. The backend source is not included in this frontend package. Start the backend separately using its own README/setup instructions, and confirm the routes and CORS settings. The project architecture document lists Flask setup as `pip install -r requirements.txt` and `python app.py` from the backend directory, if you have that backend folder.

## API paths referenced in the project
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/forgot-password`
- `GET /api/campaigns`
- `GET, POST /api/target-audience`
- `GET, POST /api/settings/profile`
- `POST /api/settings/update-password`
- Other dashboard, ads, billing, social, report, upload and health endpoints may be used by individual screens. Check `src/app/pages/` and verify each path against the backend.

## Before submission
- Run `npm run build` and fix any errors.
- Start the backend and verify requests in browser DevTools → Network.
- Test success, loading, empty-data and error cases, including when the backend is offline.
- Do not commit `.env`, passwords, API keys, tokens, `node_modules`, or other secrets.
- Add screenshots of the working UI and tested loading/error states.

**Important:** This package restores the frontend source from a code export. The backend is not bundled here, and API behavior has not been verified in this environment. Test it before describing Task 3 as completed.
