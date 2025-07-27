<?php
/**
 * GameZone Backend Entry Point
 * Main router for all API requests
 */

// Enable CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type
header('Content-Type: application/json; charset=utf-8');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include required files
require_once 'config/database.php';
require_once 'config/config.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/GameController.php';
require_once 'controllers/OrderController.php';
require_once 'controllers/UserController.php';
require_once 'controllers/AdminController.php';

// Start session
session_start();

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');
$segments = explode('/', $uri);

// Remove 'backend' from segments if present
if ($segments[0] === 'backend') {
    array_shift($segments);
}

// Get the endpoint
$endpoint = $segments[0] ?? '';

try {
    // Route requests
    switch ($endpoint) {
        case 'auth':
            $controller = new AuthController();
            handleAuthRoutes($controller, $segments, $method);
            break;
            
        case 'games':
            $controller = new GameController();
            handleGameRoutes($controller, $segments, $method);
            break;
            
        case 'orders':
            $controller = new OrderController();
            handleOrderRoutes($controller, $segments, $method);
            break;
            
        case 'users':
            $controller = new UserController();
            handleUserRoutes($controller, $segments, $method);
            break;
            
        case 'admin':
            $controller = new AdminController();
            handleAdminRoutes($controller, $segments, $method);
            break;
            
        case 'health':
            echo json_encode([
                'status' => 'success',
                'message' => 'GameZone API is running',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Endpoint not found'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error',
        'error' => $e->getMessage()
    ]);
}

// Auth routes handler
function handleAuthRoutes($controller, $segments, $method) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case 'login':
            if ($method === 'POST') {
                $controller->login();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'register':
            if ($method === 'POST') {
                $controller->register();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'logout':
            if ($method === 'POST') {
                $controller->logout();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'verify':
            if ($method === 'GET') {
                $controller->verifyToken();
            } else {
                methodNotAllowed();
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Auth endpoint not found']);
            break;
    }
}

// Game routes handler
function handleGameRoutes($controller, $segments, $method) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case '':
            if ($method === 'GET') {
                $controller->getAllGames();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'popular':
            if ($method === 'GET') {
                $controller->getPopularGames();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'packages':
            $gameId = $segments[2] ?? null;
            if ($method === 'GET' && $gameId) {
                $controller->getGamePackages($gameId);
            } else {
                methodNotAllowed();
            }
            break;
            
        default:
            // Check if it's a game ID
            if (is_numeric($action)) {
                if ($method === 'GET') {
                    $controller->getGame($action);
                } else {
                    methodNotAllowed();
                }
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Game endpoint not found']);
            }
            break;
    }
}

// Order routes handler
function handleOrderRoutes($controller, $segments, $method) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case '':
            if ($method === 'GET') {
                $controller->getUserOrders();
            } elseif ($method === 'POST') {
                $controller->createOrder();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'status':
            $orderId = $segments[2] ?? null;
            if ($method === 'GET' && $orderId) {
                $controller->getOrderStatus($orderId);
            } else {
                methodNotAllowed();
            }
            break;
            
        default:
            // Check if it's an order ID
            if (is_numeric($action)) {
                if ($method === 'GET') {
                    $controller->getOrder($action);
                } elseif ($method === 'PUT') {
                    $controller->updateOrder($action);
                } elseif ($method === 'DELETE') {
                    $controller->cancelOrder($action);
                } else {
                    methodNotAllowed();
                }
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Order endpoint not found']);
            }
            break;
    }
}

// User routes handler
function handleUserRoutes($controller, $segments, $method) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case 'profile':
            if ($method === 'GET') {
                $controller->getProfile();
            } elseif ($method === 'PUT') {
                $controller->updateProfile();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'settings':
            if ($method === 'GET') {
                $controller->getSettings();
            } elseif ($method === 'PUT') {
                $controller->updateSettings();
            } else {
                methodNotAllowed();
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User endpoint not found']);
            break;
    }
}

// Admin routes handler
function handleAdminRoutes($controller, $segments, $method) {
    $action = $segments[1] ?? '';
    
    switch ($action) {
        case 'dashboard':
            if ($method === 'GET') {
                $controller->getDashboardStats();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'orders':
            if ($method === 'GET') {
                $controller->getAllOrders();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'users':
            if ($method === 'GET') {
                $controller->getAllUsers();
            } else {
                methodNotAllowed();
            }
            break;
            
        case 'games':
            if ($method === 'GET') {
                $controller->getGamesManagement();
            } elseif ($method === 'POST') {
                $controller->createGame();
            } else {
                methodNotAllowed();
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Admin endpoint not found']);
            break;
    }
}

// Method not allowed helper
function methodNotAllowed() {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed'
    ]);
}
?>
