<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventsController extends Controller
{
    private function mapEvent(Event $event): array
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'summary' => $event->summary,
            'startAt' => optional($event->start_at)->toIso8601String(),
            'endAt' => optional($event->end_at)->toIso8601String(),
            'location' => $event->location,
            'highlight' => $event->highlight,
            'cover' => $event->cover,
            'seo' => $event->seo,
            'body' => $event->body,
            'cta' => $event->cta,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $month = $request->query('month');
        $year = $request->query('year');

        $query = Event::query()->orderBy('start_at');

        if ($year !== null && $year !== '') {
            $query->whereYear('start_at', (int) $year);
        }

        if ($month !== null && $month !== '') {
            $query->whereMonth('start_at', (int) $month);
        }

        $items = $query->get()->map(fn (Event $event) => $this->mapEvent($event))->values();

        return response()->json([
            'updatedAt' => now()->toISOString(),
            'items' => $items,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $event = Event::query()->find($id);

        if (!$event) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json([
            'item' => $this->mapEvent($event),
        ]);
    }
}
