<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\JsonResponse;

class PricesController extends Controller
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

    public function index(): JsonResponse
    {
        $items = Car::query()
            ->orderBy('model')
            ->orderBy('version')
            ->get()
            ->map(fn (Car $car) => $this->mapCar($car))
            ->values();

        return response()->json([
            'updatedAt' => now()->toISOString(),
            'items' => $items,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $car = Car::query()->find($id);

        if (!$car) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json([
            'item' => $this->mapCar($car),
        ]);
    }
}
