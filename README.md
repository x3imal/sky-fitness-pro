# SkyFitnessPro

SkyFitnessPro is a Next.js application for online fitness courses, workouts, and progress tracking.

## Features

- User login and registration
- Course catalog
- Course details page
- Workout selection flow
- Workout progress tracking and saving
- Profile page with selected courses and progress
- Modal routes for auth, workout selection, and progress entry
- Responsive layout for desktop, tablet, and mobile
- User-facing error handling for key API flows

## Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit
- redux-persist
- CSS Modules
- Vitest

## Requirements

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Run Locally

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

Tests:

```bash
npm test
```

## Environment

The app uses `NEXT_PUBLIC_API_BASE_URL` for API requests.

If the variable is not provided, the default API base from [`shared/services/apiClient.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/services/apiClient.ts) is used.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=https://wedev-api.sky.pro
```

## Testing

The project uses `Vitest` for unit tests.

Current coverage focuses on core business logic:

- auth form validation
- course slug resolving
- shared API client error handling
- Redux selectors
- `catalogSlice`
- `authSlice`
- `progressSlice`

Test files:

- [shared/util/authValidation.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/util/authValidation.test.ts)
- [shared/util/resolveCourseSlug.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/util/resolveCourseSlug.test.ts)
- [shared/services/apiClient.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/services/apiClient.test.ts)
- [store/selectors.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/selectors.test.ts)
- [store/slices/catalogSlice.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/slices/catalogSlice.test.ts)
- [store/slices/authSlice.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/slices/authSlice.test.ts)
- [store/slices/progressSlice.test.ts](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/slices/progressSlice.test.ts)

## Error Handling

API calls are centralized in [`shared/services/apiClient.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/services/apiClient.ts).

The app uses a shared pattern:

- `apiClient` throws normalized `Error` messages
- async thunks convert failures to `rejectWithValue(...)`
- UI components display user-facing error messages for important flows

This is applied to:

- catalog loading
- auth flows
- add/remove course actions
- workout loading
- workout progress loading and saving

## Project Structure

### App

- [`app/page.tsx`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/app/page.tsx): home page
- [`app/course/[id]/page.tsx`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/app/course/[id]/page.tsx): course page
- [`app/workouts/[course]/page.tsx`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/app/workouts/[course]/page.tsx): workout selection page
- [`app/workout/[id]/page.tsx`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/app/workout/[id]/page.tsx): workout page
- [`app/profile/page.tsx`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/app/profile/page.tsx): profile page
- [`app/@modal`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/app/@modal): intercepting modal routes

### Components

- [`components/AuthModal`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/components/AuthModal): auth UI
- [`components/CourseCard`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/components/CourseCard): course card
- [`components/CourseCTA`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/components/CourseCTA): CTA block on course page
- [`components/WorkoutSelect`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/components/WorkoutSelect): workout picker
- [`components/WorkoutExercisesCard`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/components/WorkoutExercisesCard): workout exercises and progress CTA
- [`components/ProgressModal`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/components/ProgressModal): progress entry modal

### Store

- [`store/store.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/store.ts): Redux store setup
- [`store/selectors.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/selectors.ts): selectors
- [`store/slices/authSlice.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/slices/authSlice.ts): auth state and thunks
- [`store/slices/catalogSlice.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/slices/catalogSlice.ts): catalog state
- [`store/slices/progressSlice.ts`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/slices/progressSlice.ts): workout progress state

### Shared

- [`shared/services`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/services): API layer
- [`shared/util`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/util): utility functions
- [`shared/types`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/shared/types): shared types

## Notes

- State for auth and progress is persisted with `redux-persist`.
- Catalog loading is bootstrapped on the client in [`store/StoreBootstrap.tsx`](/abs/path/C:/Users/Lenovo/WebstormProjects/sky-fitness-pro/store/StoreBootstrap.tsx).
- Tablet styles were added for the main layout, cards, CTA, profile, course, and workout screens.
