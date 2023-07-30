<?php

use Speradevlop\Api\Controllers\CalculatorController;

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    $r->addGroup('/api', function(FastRoute\RouteCollector $r) {
        $r->get('/', [CalculatorController::class, 'index']);
        $r->post('/', [CalculatorController::class, 'store']);
        $r->get('/statics', [CalculatorController::class, 'statics']);
        $r->get('/getAllCalculate', [CalculatorController::class, 'getAllCalculate']);
    });
});

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);




$routeInfo = $dispatcher->dispatch($method, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        notFoundHandler();
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        $body = json_decode(file_get_contents('php://input'), true);
        $handler($vars, $body);
        // ... call $handler with $vars
        break;
}

