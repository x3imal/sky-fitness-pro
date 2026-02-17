# SkyFitnessPro

SkyFitnessPro — приложение для онлайн‑тренировок.

## Что есть в приложении

- Авторизация и регистрация пользователя
- Каталог курсов
- Просмотр тренировок внутри курса
- Заполнение и сохранение прогресса
- Профиль пользователя с выбранными курсами и прогрессом

## File Documentation

Минимальное описание назначения файлов проекта.

## Root

- `README.md` — базовое описание проекта.
- `package.json` — скрипты и зависимости.
- `package-lock.json` — lockfile npm.
- `tsconfig.json` — конфигурация TypeScript.
- `next.config.ts` — конфигурация Next.js.
- `postcss.config.mjs` — конфигурация PostCSS.
- `eslint.config.mjs` — конфигурация ESLint.

## App Routes

- `app/layout.tsx` — корневой layout, подключение `ReduxProvider`, `Header`, modal slot.
- `app/globals.css` — глобальные стили.
- `app/favicon.ico` — favicon.
- `app/page.tsx` — главная страница (композиция контента).
- `app/page.module.css` — стили главной страницы.
- `app/auth/page.tsx` — standalone-страница авторизации.
- `app/profile/page.tsx` — страница профиля пользователя.
- `app/profile/page.module.css` — стили профиля.
- `app/course/[id]/page.tsx` — страница курса.
- `app/course/[id]/page.module.css` — стили страницы курса.
- `app/workouts/[course]/page.tsx` — standalone-страница выбора тренировки.
- `app/workouts/[course]/page.module.css` — стили страницы выбора тренировки.
- `app/workout/[id]/page.tsx` — страница конкретной тренировки (видео + упражнения).
- `app/workout/[id]/page.module.css` — стили страницы тренировки.
- `app/workout/[id]/progress/page.tsx` — standalone-страница ввода прогресса.

## Intercept/Modal Routes

- `app/@modal/default.tsx` — пустой default slot для модалок.
- `app/@modal/(.)auth/page.tsx` — auth как modal route.
- `app/@modal/(.)workouts/[course]/page.tsx` — выбор тренировки как modal route.
- `app/@modal/(.)workouts/[course]/page.module.css` — стили модального выбора тренировки.
- `app/@modal/(.)workout/[id]/progress/page.tsx` — ввод прогресса как modal route.

## Components

- `components/Header/Header.tsx` — хедер, кнопка входа/профиля, меню пользователя.
- `components/Header/Header.module.css` — стили хедера.
- `components/AuthGuard/AuthGuard.tsx` — защита приватных страниц.
- `components/AuthModal/AuthModal.tsx` — форма входа/регистрации.
- `components/AuthModal/AuthModal.module.css` — стили auth-модалки.
- `components/HomePageContent/HomePageContent.tsx` — контент главной + skeletons.
- `components/CourseCard/CourseCard.tsx` — карточка курса (добавить/удалить, прогресс, CTA).
- `components/CourseCard/CourseCard.module.css` — стили карточки курса.
- `components/CourseCTA/CourseCTA.tsx` — CTA-блок на странице курса.
- `components/CourseCTA/CourseCTA.module.css` — стили CTA-блока.
- `components/WorkoutSelect/WorkoutSelect.tsx` — список тренировок в модалке/странице выбора.
- `components/WorkoutSelect/WorkoutSelect.module.css` — стили выбора тренировок.
- `components/WorkoutExercisesCard/WorkoutExercisesCard.tsx` — список упражнений тренировки + кнопка прогресса.
- `components/WorkoutExercisesCard/WorkoutExercisesCard.module.css` — стили карточки упражнений.
- `components/ProgressModal/ProgressModal.tsx` — форма ввода прогресса + модалка успешного сохранения.
- `components/ProgressModal/ProgressModal.module.css` — стили прогресс-модалки.
- `components/ui/Button/Button.tsx` — общий компонент кнопки.
- `components/ui/Button/Button.module.css` — стили кнопки.
- `components/ui/Theme/courseTheme.ts` — маппинг тем/картинок по курсам.

## Shared: Services

- `shared/services/apiClient.ts` — общий HTTP-клиент (base URL, timeout, обработка ошибок).
- `shared/services/authService.ts` — API авторизации/регистрации/`me`.
- `shared/services/courseService.ts` — API курсов и добавления/удаления курса у пользователя.
- `shared/services/workoutService.ts` — API тренировок и прогресса.
- `shared/services/catalogService.ts` — сбор каталога курсов в формат приложения.

## Shared: Utils

- `shared/util/authValidation.ts` — клиентская валидация форм auth.
- `shared/util/catalogQueries.ts` — async-утилиты для поиска курса/тренировок в каталоге.
- `shared/util/getCourseTheme.ts` — получение темы курса по slug/id.
- `shared/util/resolveCourseSlug.ts` — нормализация slug курса.

## Shared: Types

- `shared/types/course.ts` — типы курса.
- `shared/types/workout.ts` — типы тренировки и упражнений.
- `shared/types/catalog.ts` — типы каталога и `workoutsByCourseSlug`.

## Store

- `store/store.ts` — конфигурация Redux Toolkit + redux-persist + migration.
- `store/hooks.ts` — typed hooks (`useAppDispatch`, `useAppSelector`).
- `store/ReduxProvider.tsx` — провайдер store + persist gate.
- `store/StoreBootstrap.tsx` — bootstrap-логика стора на клиенте.
- `store/selectors.ts` — селекторы состояния приложения.
- `store/slices/authSlice.ts` — auth state и async thunks (login/register/me, add/remove course).
- `store/slices/catalogSlice.ts` — каталог курсов.
- `store/slices/progressSlice.ts` — прогресс по упражнениям/тренировкам.

## Public Assets

- `public/logo.svg` — логотип.
- `public/Massage.svg` — иллюстрация hero.
- `public/file.svg` — служебная иконка.
- `public/globe.svg` — служебная иконка.
- `public/window.svg` — служебная иконка.
- `public/next.svg` — дефолтный ассет Next.js.
- `public/vercel.svg` — дефолтный ассет Vercel.
- `public/icons/Calendar.svg` — иконка календаря.
- `public/icons/watch.svg` — иконка времени.
- `public/icons/complexity.svg` — иконка сложности.
- `public/icons/plus.svg` — иконка добавления курса.
- `public/icons/minus.svg` — иконка удаления курса.
- `public/images/courses/Yoga.png` — карточка: Йога.
- `public/images/courses/fitness.png` — карточка: Фитнес.
- `public/images/courses/stretching.png` — карточка: Стретчинг.
- `public/images/courses/step.png` — карточка: Степ-аэробика.
- `public/images/courses/bodyflex.png` — карточка: Бодифлекс.
- `public/images/courses/yoga-hero.png` — hero: Йога.
- `public/images/courses/fitness-hero.png` — hero: Фитнес.
- `public/images/courses/stretching-hero.png` — hero: Стретчинг.
- `public/images/courses/step-hero.png` — hero: Степ-аэробика.
- `public/images/courses/bodyflex-hero.png` — hero: Бодифлекс.
- `public/images/cta/common-cta.png` — изображение CTA.
- `public/images/cta/line-cta.png` — линия CTA.
- `public/images/profile/avatarBase.png` — фон аватара профиля.
- `public/images/profile/avatar-head.png` — верхняя часть аватара.
- `public/images/profile/avatar-body.png` — нижняя часть аватара.
