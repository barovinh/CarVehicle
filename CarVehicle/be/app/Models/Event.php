<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'summary',
        'start_at',
        'end_at',
        'location',
        'highlight',
        'cover',
        'seo',
        'body',
        'cta',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'cover' => 'array',
        'seo' => 'array',
        'body' => 'array',
        'cta' => 'array',
    ];
}
