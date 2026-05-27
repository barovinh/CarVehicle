# CarVehicle

The workspace is split into two modules:

- `be/`: Laravel backend and API.
- `fe/`: Vue 3 frontend.

## Run Locally

Frontend:

```sh
cd fe
npm install
npm run dev
```

Backend:

```sh
cd be
composer install
php artisan serve
```

## Build

The frontend build writes its assets into `be/public/build`, so the Laravel app can serve the compiled bundle.

```sh
cd fe
npm run build
```
