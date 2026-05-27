<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\FeaturedProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeaturedProductsAdminController extends Controller
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

    private function mapFeatured(FeaturedProduct $featured): array
    {
        return [
            'id' => $featured->id,
            'carId' => $featured->car_id,
            'position' => (int) $featured->position,
            'isActive' => (bool) $featured->is_active,
            'startsAt' => optional($featured->starts_at)->toIso8601String(),
            'endsAt' => optional($featured->ends_at)->toIso8601String(),
            'car' => $featured->car ? $this->mapCar($featured->car) : null,
        ];
    }

    public function index(): JsonResponse
    {
        $items = FeaturedProduct::query()
            ->orderBy('position')
            ->with('car')
            ->get()
            ->map(fn (FeaturedProduct $featured) => $this->mapFeatured($featured))
            ->values();

        return response()->json([
            'updatedAt' => now()->toISOString(),
            'items' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'carId' => ['required', 'string', 'exists:cars,id'],
            'position' => ['nullable', 'integer', 'min:0'],
            'isActive' => ['nullable', 'boolean'],
            'startsAt' => ['nullable', 'date'],
            'endsAt' => ['nullable', 'date'],
        ]);

        $featured = FeaturedProduct::query()->create([
            'car_id' => $data['carId'],
            'position' => $data['position'] ?? 0,
            'is_active' => $data['isActive'] ?? true,
            'starts_at' => $data['startsAt'] ?? null,
            'ends_at' => $data['endsAt'] ?? null,
        ]);

        $featured->load('car');

        return response()->json(['item' => $this->mapFeatured($featured)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $featured = FeaturedProduct::query()->with('car')->find($id);
        if (!$featured) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $data = $request->validate([
            'carId' => ['required', 'string', 'exists:cars,id'],
            'position' => ['nullable', 'integer', 'min:0'],
            'isActive' => ['nullable', 'boolean'],
            'startsAt' => ['nullable', 'date'],
            'endsAt' => ['nullable', 'date'],
        ]);

        $featured->fill([
            'car_id' => $data['carId'],
            'position' => $data['position'] ?? 0,
            'is_active' => $data['isActive'] ?? true,
            'starts_at' => $data['startsAt'] ?? null,
            'ends_at' => $data['endsAt'] ?? null,
        ]);
        $featured->save();
        $featured->load('car');

        return response()->json(['item' => $this->mapFeatured($featured)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $featured = FeaturedProduct::query()->find($id);
        if (!$featured) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $featured->delete();

        return response()->json(['ok' => true]);
    }
}
