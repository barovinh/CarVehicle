FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip curl libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# NodeJS 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# =========================
# FRONTEND BUILD
# =========================
WORKDIR /app/fe

RUN npm install --legacy-peer-deps --force

RUN npm run build

# =========================
# LARAVEL
# =========================
WORKDIR /app/be

RUN composer install --no-dev --optimize-autoloader

RUN php artisan optimize:clear || true

RUN mkdir -p database

RUN touch database/database.sqlite

RUN chmod -R 777 storage bootstrap/cache database

RUN cp .env.example .env || true

RUN php artisan key:generate --force

RUN php artisan migrate --force || true

EXPOSE 10000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]