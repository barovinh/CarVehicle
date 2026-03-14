<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $table = 'cars';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'brand',
        'model',
        'version',
        'price',
        'image',
        'description',
        'interior_images',
        'hood_image',
        'trunk_image',
    ];

    protected $casts = [
        'price' => 'integer',
        'interior_images' => 'array',
    ];
}
