<!DOCTYPE html>
<html>
<head>
    <title>ELTE MUSIC</title>
</head>
<body>
    <h1>ELTE MUSIC</h1>
    <p>Találd meg kedvenc zeneszámaidat vagy hozz létre saját listákat!</p>
    

    <?php
    session_start();
    if (isset($_SESSION['user'])) {
        echo '<p>Üdvözlünk, ' . $_SESSION['user']['username'] . '!</p>';
        echo '<p><a href="logout.php">Kijelentkezés</a></p>';
        echo '<form method="POST" action="create_playlist.php" novalidate>
            <label for="name">Lejátszási lista neve</label>
            <input type="text" name="name" id="name" required> <br>
            <label for="public">Publikus</label>
            <input type="checkbox" name="public" id="public"> <br>
            <input type="submit" value="Lejátszási lista létrehozása">
        </form>';
    } else {
        echo '<div><a href="login.php">Bejelentkezés</a></div>';
        echo '<div><a href="register.php">Regisztráció</a></div>';
    }
    ?>


    <form method="GET" action="index.php" novalidate>
        <input type="text" name="search" placeholder="Keresés zeneszámra">
        <input type="submit" value="Keresés">
    </form>


    <?php

        include_once "storage.php";

        $userStorage = new Storage('users.json');
        $users = json_decode(file_get_contents('users.json'), true);
        $tracks = json_decode(file_get_contents('tracks.json'), true);
        $playlists = json_decode(file_get_contents('playlists.json'), true);

        $trackStorage = new Storage('tracks.json');

        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = $_GET['search'];
            $tracks = $trackStorage->searchByTrack($search);

            foreach($tracks as $track) {
                echo '<div>';
                echo '<h2>' . $track['title'] . '</h2>';
                echo '<p>Előadó: ' . $track['artist'] . '</p>';
                echo '</div>';
            }
        }

        if($playlists != null){
            foreach($playlists as $playlist) {
                if($playlist['public'] === true || (isset($_SESSION['user']['id']) && $_SESSION['user']['id'] === $playlist['created_by'])){
                    echo '<div>';
                    echo '<h2>' . $playlist['name'] . '</h2>';
                    echo '<p>Darabszám: ' . count($playlist['tracks']) . '</p>';
                    echo '<p>Létrehozó: ' . $userStorage->getById($playlist['created_by'])['username'] . '</p>';
                    echo '<a href="details.php?name=' . urlencode($playlist['name']) . '">Részletek</a>';
                    echo '</div>';
                }
            }
        }
    ?>
</body>
</html>