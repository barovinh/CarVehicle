<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            // From src/mock/prices.js
            $table->string('id')->primary(); // e.g. city-rs
            $table->string('brand');
            $table->string('model');
            $table->string('version');

            $table->unsignedBigInteger('price');
            $table->string('image');
            $table->text('description');

            $table->json('interior_images')->nullable();
            $table->string('hood_image')->nullable();
            $table->string('trunk_image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
