<!DOCTYPE html>
<html>
<head>
    <title>Bejelentkezés</title>
</head>
<body>
    <h1>Bejelentkezés</h1>
    <form method="POST" action="login.php" novalidate>
        <label for="username">Felhasználónév</label>
        <input type="text" name="username" id="username" required> <br>
        <label for="password">Jelszó</label>
        <input type="password" name="password" id="password" required> <br>
        <input type="submit" value="Bejelentkezés">
    </form>
    <a href="index.php">Főoldal</a>
    <a href="register.php">Regisztráció</a>
</body>
</html>

<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $users = json_decode(file_get_contents('users.json'), true);

    foreach ($users as $id => $user) {
        if ($user['username'] === $username) {
            if ($password === $user['password']) {
                $_SESSION['user'] = $users[$id];
                header('Location: index.php');
            } else {
                echo 'Hibás jelszó!';
            }
            return;
        }
    }
    echo 'A felhasználónév nem található!';
}
?>


