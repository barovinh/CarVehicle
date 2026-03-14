<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $expectedUser = (string) env('ADMIN_USERNAME', 'admin_giabao');
        $expectedPass = (string) env('ADMIN_PASSWORD', 'baoluu0711');

        if ($data['username'] !== $expectedUser || $data['password'] !== $expectedPass) {
            return response()->json(['ok' => false, 'error' => 'Invalid credentials'], 401);
        }

        return response()->json(['ok' => true]);
    }
}
