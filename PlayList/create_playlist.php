<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user']['id'])) {
    $name = $_POST['name'];
    $public = isset($_POST['public']);

    $playlists = json_decode(file_get_contents('playlists.json'), true);

    $playlists[] = [
        'name' => $name,
        'public' => $public, 
        'created_by' => $_SESSION['user']['id'],
        'tracks' => []
    ];

    file_put_contents('playlists.json', json_encode($playlists, JSON_PRETTY_PRINT));

    header('Location: index.php');
} else {
    header('Location: index.php');
}
?>


