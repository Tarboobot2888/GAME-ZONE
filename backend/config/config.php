<?php
/**
 * Application Configuration
 */

// Load environment variables
if (file_exists(__DIR__ . '/../../.env')) {
    $lines = file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Application settings
define('APP_NAME', 'GameZone');
define('APP_VERSION', '1.0.0');
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_DEBUG', $_ENV['APP_DEBUG'] ?? true);

// Database settings
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'gamezone_db');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');

// JWT settings
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'your-secret-key-here');
define('JWT_EXPIRE', $_ENV['JWT_EXPIRE'] ?? 86400); // 24 hours

// Firebase settings
define('FIREBASE_PROJECT_ID', $_ENV['FIREBASE_PROJECT_ID'] ?? 'game-9bef3');
define('FIREBASE_API_KEY', $_ENV['FIREBASE_API_KEY'] ?? 'AIzaSyAvy-5ypgeuAPomgI_PqMfuUIC3Ywt0OUM');

// Payment settings
define('PAYMENT_GATEWAY_URL', $_ENV['PAYMENT_GATEWAY_URL'] ?? 'https://api.payment.com');
define('PAYMENT_MERCHANT_ID', $_ENV['PAYMENT_MERCHANT_ID'] ?? 'merchant123');
define('PAYMENT_SECRET_KEY', $_ENV['PAYMENT_SECRET_KEY'] ?? 'payment-secret');

// Email settings
define('SMTP_HOST', $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com');
define('SMTP_PORT', $_ENV['SMTP_PORT'] ?? 587);
define('SMTP_USERNAME', $_ENV['SMTP_USERNAME'] ?? '');
define('SMTP_PASSWORD', $_ENV['SMTP_PASSWORD'] ?? '');
define('FROM_EMAIL', $_ENV['FROM_EMAIL'] ?? 'noreply@gamezone.com');
define('FROM_NAME', $_ENV['FROM_NAME'] ?? 'GameZone');

// File upload settings
define('UPLOAD_MAX_SIZE', $_ENV['UPLOAD_MAX_SIZE'] ?? 5242880); // 5MB
define('UPLOAD_ALLOWED_TYPES', $_ENV['UPLOAD_ALLOWED_TYPES'] ?? 'jpg,jpeg,png,gif');
define('UPLOAD_PATH', $_ENV['UPLOAD_PATH'] ?? '../assets/uploads/');

// Security settings
define('BCRYPT_COST', $_ENV['BCRYPT_COST'] ?? 12);
define('SESSION_LIFETIME', $_ENV['SESSION_LIFETIME'] ?? 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', $_ENV['MAX_LOGIN_ATTEMPTS'] ?? 5);
define('LOGIN_LOCKOUT_TIME', $_ENV['LOGIN_LOCKOUT_TIME'] ?? 900); // 15 minutes

// API settings
define('API_RATE_LIMIT', $_ENV['API_RATE_LIMIT'] ?? 100); // requests per minute
define('API_VERSION', $_ENV['API_VERSION'] ?? 'v1');

// Logging settings
define('LOG_LEVEL', $_ENV['LOG_LEVEL'] ?? 'INFO');
define('LOG_FILE', $_ENV['LOG_FILE'] ?? '../logs/app.log');

// Cache settings
define('CACHE_ENABLED', $_ENV['CACHE_ENABLED'] ?? true);
define('CACHE_TTL', $_ENV['CACHE_TTL'] ?? 3600); // 1 hour

// Game-specific settings
define('ORDER_PROCESSING_TIME', $_ENV['ORDER_PROCESSING_TIME'] ?? 600); // 10 minutes
define('SUPPORTED_GAMES', [
    'pes_mobile' => 'PES Mobile',
    'fifa_mobile' => 'FIFA Mobile',
    'pubg_mobile' => 'PUBG Mobile',
    'free_fire' => 'Free Fire',
    'cod_mobile' => 'Call of Duty Mobile',
    'mobile_legends' => 'Mobile Legends'
]);

// Timezone
date_default_timezone_set($_ENV['TIMEZONE'] ?? 'Asia/Riyadh');

// Error handling
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Helper functions
function isProduction() {
    return APP_ENV === 'production';
}

function isDevelopment() {
    return APP_ENV === 'development';
}

function config($key, $default = null) {
    return $_ENV[$key] ?? $default;
}

function logError($message, $context = []) {
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] ERROR: $message";
    
    if (!empty($context)) {
        $logMessage .= " Context: " . json_encode($context);
    }
    
    error_log($logMessage . PHP_EOL, 3, LOG_FILE);
}

function logInfo($message, $context = []) {
    if (LOG_LEVEL === 'DEBUG' || LOG_LEVEL === 'INFO') {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] INFO: $message";
        
        if (!empty($context)) {
            $logMessage .= " Context: " . json_encode($context);
        }
        
        error_log($logMessage . PHP_EOL, 3, LOG_FILE);
    }
}

// CORS helper
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

// JSON response helper
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Validation helper
function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missing[] = $field;
        }
    }
    return $missing;
}

// Sanitization helper
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Generate UUID
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
?>
