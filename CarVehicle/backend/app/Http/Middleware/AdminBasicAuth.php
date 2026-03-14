<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminBasicAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $expectedUser = (string) env('ADMIN_USERNAME', 'admin_giabao');
        $expectedPass = (string) env('ADMIN_PASSWORD', 'baoluu0711');

        $user = (string) $request->getUser();
        $pass = (string) $request->getPassword();

        if ($user !== $expectedUser || $pass !== $expectedPass) {
            return response()->json(
                ['error' => 'Unauthorized'],
                401,
                ['WWW-Authenticate' => 'Basic realm="Admin"']
            );
        }

        return $next($request);
    }
}
