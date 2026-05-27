<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedProduct extends Model
{
    protected $table = 'featured_products';

    protected $fillable = [
        'car_id',
        'position',
        'is_active',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'position' => 'integer',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class, 'car_id', 'id');
    }
}
