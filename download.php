<?php
// Ruta al archivo que deseas descargar
$filePath = 'assets/mp3/ADOBE - LODO CLANDESTINO.mp3';
$counterFile = '00.txt';

// Verifica si el archivo existe
if (file_exists($filePath)) {
    // Establecer encabezados para la descarga
    header('Content-Description: File Transfer');
    header('Content-Type: audio/mpeg');
    header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));

    // Leer el archivo y enviarlo al navegador
    readfile($filePath);

    // Recopilar fecha, hora, navegador y dispositivo
    $currentDateTime = date('Y-m-d H:i:s');
    $userAgent = $_SERVER['HTTP_USER_AGENT'];

    // Identificar el navegador
    if (preg_match('/Edg/i', $userAgent)) {
        $browser = 'Microsoft Edge';
    } elseif (preg_match('/Firefox/i', $userAgent)) {
        $browser = 'Mozilla Firefox';
    } elseif (preg_match('/Chrome/i', $userAgent)) {
        $browser = 'Google Chrome';
    } elseif (preg_match('/Safari/i', $userAgent)) {
        $browser = 'Apple Safari';
    } elseif (preg_match('/MSIE|Trident/i', $userAgent)) {
        $browser = 'Internet Explorer';
    } else {
        $browser = 'Otros';
    }

    // Identificar si es Android o iPhone
    if (preg_match('/Android/i', $userAgent)) {
        $deviceType = 'Android';
    } elseif (preg_match('/iPhone/i', $userAgent)) {
        $deviceType = 'iPhone';
    } else {
        $deviceType = 'Otros';
    }

    // Leer el número de descargas actuales
    $currentCount = 0;
    if (file_exists($counterFile)) {
        $currentCount = count(file($counterFile));
    }

    // Incrementar el número de descargas
    $downloadEntry = ($currentCount + 1) .
        " - Fecha y hora: $currentDateTime - Navegador: $browser - Dispositivo: $deviceType" . PHP_EOL;

    // Guardar la descarga en el archivo
    file_put_contents($counterFile, $downloadEntry, FILE_APPEND);

    // Asegúrate de que el script se detenga después de la descarga
    exit;
} else {
    // Manejo de error si el archivo no existe
    http_response_code(404);
    echo "Archivo no encontrado.";
}
