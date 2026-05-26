FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip curl nodejs npm libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps --force

WORKDIR /app/backend
RUN npm run build

RUN composer install --no-dev --optimize-autoloader

RUN mkdir -p database
RUN touch database/database.sqlite

RUN chmod -R 777 storage bootstrap/cache database

RUN php artisan key:generate --force
RUN php artisan migrate --force

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000