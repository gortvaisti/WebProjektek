<?php
session_start();

include_once 'storage.php';

$playlistStorage = new Storage('playlists.json');
$trackStorage = new Storage('tracks.json');

if (!isset($_GET['name'])) {
    die('Hiányzik a lejátszási lista neve!');
}

$playlist = $playlistStorage->searchByPlaylist(urldecode($_GET['name']));

if (empty($playlist)) {
    die('Nincs ilyen nevű lejátszási lista: ' . urldecode($_GET['name']));
}

$tracks = $playlist[0]['tracks'];

echo "<h1>Lejátszási lista: " . $playlist[0]['name'] . "</h1>";

$totalLength = 0;

foreach ($tracks as $trackId) {
    $track = $trackStorage->getById($trackId);
    $totalLength += $track['length'];
}

echo "<h2>Lejátszási lista hossza: " . $totalLength . " másodperc</h2>";

foreach ($tracks as $trackId) {
    $track = $trackStorage->getById($trackId);
    echo "<div>";
    echo "<h2>" . $track['title'] . "</h2>";
    echo "<p>Előadó: " . $track['artist'] . "</p>";
    echo "<p>Hossz: " . $track['length'] . " seconds</p>";
    echo "<p>Év: " . $track['year'] . "</p>";
    echo "<p>Műfaj: " . implode(', ', $track['genres']) . "</p>";
    echo "</div>";
}

?>



