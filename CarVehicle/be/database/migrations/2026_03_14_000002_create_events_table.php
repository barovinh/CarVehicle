<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            // From src/mock/events.js
            $table->string('id')->primary(); // e.g. launch-march-2026-city
            $table->string('title');
            $table->text('summary');

            $table->dateTimeTz('start_at');
            $table->dateTimeTz('end_at')->nullable();

            $table->string('location')->nullable();
            $table->text('highlight')->nullable();

            // Article-like content
            $table->json('cover')->nullable(); // { src, alt }
            $table->json('seo')->nullable(); // { title, description }
            $table->json('body')->nullable(); // array of blocks
            $table->json('cta')->nullable(); // { label, to }

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
