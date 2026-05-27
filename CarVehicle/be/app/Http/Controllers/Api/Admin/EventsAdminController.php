<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventsAdminController extends Controller
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

    public function index(): JsonResponse
    {
        $items = Event::query()
            ->orderBy('start_at')
            ->get()
            ->map(fn (Event $event) => $this->mapEvent($event))
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
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'startAt' => ['required', 'date'],
            'endAt' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'highlight' => ['nullable', 'string'],
            'cover' => ['nullable', 'array'],
            'seo' => ['nullable', 'array'],
            'body' => ['nullable', 'array'],
            'cta' => ['nullable', 'array'],
        ]);

        $event = Event::query()->updateOrCreate(
            ['id' => $data['id']],
            [
                'title' => $data['title'],
                'summary' => $data['summary'],
                'start_at' => $data['startAt'],
                'end_at' => $data['endAt'] ?? null,
                'location' => $data['location'] ?? null,
                'highlight' => $data['highlight'] ?? null,
                'cover' => $data['cover'] ?? null,
                'seo' => $data['seo'] ?? null,
                'body' => $data['body'] ?? null,
                'cta' => $data['cta'] ?? null,
            ]
        );

        return response()->json(['item' => $this->mapEvent($event)]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $event = Event::query()->find($id);
        if (!$event) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string'],
            'startAt' => ['required', 'date'],
            'endAt' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'highlight' => ['nullable', 'string'],
            'cover' => ['nullable', 'array'],
            'seo' => ['nullable', 'array'],
            'body' => ['nullable', 'array'],
            'cta' => ['nullable', 'array'],
        ]);

        $event->fill([
            'title' => $data['title'],
            'summary' => $data['summary'],
            'start_at' => $data['startAt'],
            'end_at' => $data['endAt'] ?? null,
            'location' => $data['location'] ?? null,
            'highlight' => $data['highlight'] ?? null,
            'cover' => $data['cover'] ?? null,
            'seo' => $data['seo'] ?? null,
            'body' => $data['body'] ?? null,
            'cta' => $data['cta'] ?? null,
        ]);
        $event->save();

        return response()->json(['item' => $this->mapEvent($event)]);
    }

    public function destroy(string $id): JsonResponse
    {
        $event = Event::query()->find($id);
        if (!$event) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $event->delete();

        return response()->json(['ok' => true]);
    }
}
