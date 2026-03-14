<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\FeaturedProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeaturedProductsController extends Controller
{
    private function mapCar(Car $car): array
    {
        return [
            'id' => $car->id,
            'brand' => $car->brand,
            'model' => $car->model,
            'version' => $car->version,
            'price' => (int) $car->price,
            'image' => $car->image,
            'description' => $car->description,
            'interiorImages' => $car->interior_images,
            'hoodImage' => $car->hood_image,
            'trunkImage' => $car->trunk_image,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $limitRaw = $request->query('limit');
        $limit = $limitRaw !== null && $limitRaw !== '' ? (int) $limitRaw : 0;

        $now = now();

        $featuredQuery = FeaturedProduct::query()
            ->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            })
            ->orderBy('position')
            ->with('car');

        if ($limit > 0) {
            $featuredQuery->limit($limit);
        }

        $items = $featuredQuery
            ->get()
            ->pluck('car')
            ->filter()
            ->map(fn (Car $car) => $this->mapCar($car))
            ->values();

        return response()->json([
            'updatedAt' => now()->toISOString(),
            'items' => $items,
        ]);
    }
}
