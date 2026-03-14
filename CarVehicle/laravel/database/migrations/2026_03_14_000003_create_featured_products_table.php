<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('featured_products', function (Blueprint $table) {
            // Driven by src/mock/featuredProducts.js (ordered list of car ids)
            $table->id();
            $table->string('car_id');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_active')->default(true);

            // Optional scheduling for campaigns
            $table->dateTimeTz('starts_at')->nullable();
            $table->dateTimeTz('ends_at')->nullable();

            $table->timestamps();

            $table->foreign('car_id')->references('id')->on('cars')->cascadeOnDelete();
            $table->index(['is_active', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('featured_products');
    }
};
