<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarsAdminController extends Controller
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

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'version' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'image' => ['required', 'string', 'max:2048'],
            'description' => ['required', 'string'],
            'interiorImages' => ['nullable', 'array'],
            'interiorImages.*' => ['string', 'max:2048'],
            'hoodImage' => ['nullable', 'string', 'max:2048'],
            'trunkImage' => ['nullable', 'string', 'max:2048'],
        ]);

        $car = Car::query()->updateOrCreate(
            ['id' => $data['id']],
            [
                'brand' => $data['brand'],
                'model' => $data['model'],
                'version' => $data['version'],
                'price' => $data['price'],
                'image' => $data['image'],
                'description' => $data['description'],
                'interior_images' => $data['interiorImages'] ?? null,
                'hood_image' => $data['hoodImage'] ?? null,
                'trunk_image' => $data['trunkImage'] ?? null,
            ]
        );

        return response()->json(['item' => $this->mapCar($car)]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $car = Car::query()->find($id);
        if (!$car) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $data = $request->validate([
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'version' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'image' => ['required', 'string', 'max:2048'],
            'description' => ['required', 'string'],
            'interiorImages' => ['nullable', 'array'],
            'interiorImages.*' => ['string', 'max:2048'],
            'hoodImage' => ['nullable', 'string', 'max:2048'],
            'trunkImage' => ['nullable', 'string', 'max:2048'],
        ]);

        $car->fill([
            'brand' => $data['brand'],
            'model' => $data['model'],
            'version' => $data['version'],
            'price' => $data['price'],
            'image' => $data['image'],
            'description' => $data['description'],
            'interior_images' => $data['interiorImages'] ?? null,
            'hood_image' => $data['hoodImage'] ?? null,
            'trunk_image' => $data['trunkImage'] ?? null,
        ]);
        $car->save();

        return response()->json(['item' => $this->mapCar($car)]);
    }

    public function destroy(string $id): JsonResponse
    {
        $car = Car::query()->find($id);
        if (!$car) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $car->delete();

        return response()->json(['ok' => true]);
    }
}
