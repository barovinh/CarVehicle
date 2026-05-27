<?php

use App\Http\Controllers\Api\EventsController;
use App\Http\Controllers\Api\FeaturedProductsController;
use App\Http\Controllers\Api\PricesController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\CarsAdminController;
use App\Http\Controllers\Api\Admin\EventsAdminController;
use App\Http\Controllers\Api\Admin\FeaturedProductsAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/prices', [PricesController::class, 'index']);
Route::get('/prices/{id}', [PricesController::class, 'show']);

Route::get('/events', [EventsController::class, 'index']);
Route::get('/events/{id}', [EventsController::class, 'show']);

Route::get('/featured-products', [FeaturedProductsController::class, 'index']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::middleware('admin.basic')->prefix('admin')->group(function () {
	Route::get('/cars', [CarsAdminController::class, 'index']);
	Route::post('/cars', [CarsAdminController::class, 'store']);
	Route::put('/cars/{id}', [CarsAdminController::class, 'update']);
	Route::delete('/cars/{id}', [CarsAdminController::class, 'destroy']);

	Route::get('/events', [EventsAdminController::class, 'index']);
	Route::post('/events', [EventsAdminController::class, 'store']);
	Route::put('/events/{id}', [EventsAdminController::class, 'update']);
	Route::delete('/events/{id}', [EventsAdminController::class, 'destroy']);

	Route::get('/featured-products', [FeaturedProductsAdminController::class, 'index']);
	Route::post('/featured-products', [FeaturedProductsAdminController::class, 'store']);
	Route::put('/featured-products/{id}', [FeaturedProductsAdminController::class, 'update']);
	Route::delete('/featured-products/{id}', [FeaturedProductsAdminController::class, 'destroy']);
});
