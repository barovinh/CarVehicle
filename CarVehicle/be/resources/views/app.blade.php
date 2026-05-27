<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'CarVehicle') }}</title>
        <link rel="stylesheet" href="{{ secure_asset('build/assets/style.css') }}">
        <script type="module" src="{{ secure_asset('build/assets/app.js') }}"></script>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>