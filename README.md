# Healthify

Healthify is a React + Vite healthcare portal for patients and doctors. It supports account signup/login, appointment booking and management, doctor discovery, notifications, profile editing, and a doctor feed with posts, comments, likes, and media uploads.

## Features

- Role-based access for `patient` and `doctor` users.
- Authentication with protected routes and persisted session checks.
- Patient appointment booking with doctor filters for specialty, language, and location.
- Appointment dashboard for viewing and canceling bookings.
- Doctor feed for creating, editing, deleting, liking, disliking, and commenting on posts.
- Notifications center with mark-as-read, mark-all-read, and delete actions.
- Profile management with support for profile details and avatar uploads through Supabase Storage.
- Home page landing experience with health service highlights and common issue cards.

## Tech Stack

- React 19
- Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS v4
- Supabase Storage
- React Icons
- React CountUp

## Prerequisites

- Node.js 18 or newer
- A running backend API for the Healthify server
- A Supabase project for profile image uploads

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and add the required values:

```bash
VITE_SERVER_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key
```

3. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - start the Vite development server.
- `npm run build` - create a production build.
- `npm run preview` - preview the production build locally.
- `npm run lint` - run ESLint across the project.

## Environment Variables

The app expects the following environment variables:

- `VITE_SERVER_URL` - base URL of the backend API.
- `VITE_SUPABASE_URL` - Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase publishable key used by the client.

## Main Routes

- `/` - home page.
- `/login` - login page.
- `/signup` - registration page.
- `/book-appointment` - patient appointment booking.
- `/appointments` - booked appointments view.
- `/feed/explore` - doctor feed.
- `/notifications` - notifications center.
- `/profile` - profile management.

Route access depends on the logged-in user role.

## Project Structure

```text
src/
	App.jsx              # App shell with navbar, footer, and auth bootstrap
	main.jsx             # React entry point
	assets/              # Images and SVG-like local assets
	components/          # Shared UI components
	features/            # Redux slices for user, doctors, appointments, notifications
	pages/               # Route-level screens
	router/              # Router configuration and protected routes
	store/               # Redux store setup
	utils/               # Shared utilities such as Supabase client setup
```

## Notes

- The app fetches the current user on load and clears the session if the request fails.
- Some pages expect backend responses with `body` payloads and appointment objects that may include either `_id` or `id` fields.
- Profile image uploads use Supabase Storage and require the storage bucket configured in `src/utils/supabase.js`.
