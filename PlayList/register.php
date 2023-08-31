<!DOCTYPE html>
<html>
<head>
    <title>Regisztráció</title>
</head>
<body>
    <h1>Regisztráció</h1>
    <form method="POST" action="register.php" novalidate>
        <label for="username">Felhasználónév</label>
        <input type="text" name="username" id="username" required> <br>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" required> <br>
        <label for="password">Jelszó</label>
        <input type="password" name="password" id="password" required> <br>
        <label for="confirm_password">Jelszó ismét</label>
        <input type="password" name="confirm_password" id="confirm_password" required> <br>
        <input type="submit" value="Regisztráció">
    </form>
    <a href="index.php">Főoldal</a>
    <a href="login.php">Bejelentkezés</a>
</body>
</html>


<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Az email cím nem megfelelő formátumú!';
    } else if ($password !== $confirm_password) {
        echo 'A jelszavak nem egyeznek meg!';
    } else {
        $users = json_decode(file_get_contents('users.json'), true);
        $id = 'userid' . (count($users) + 1);

        $users[$id] = [
            'id' => $id,
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'isAdmin' => false
        ];
        file_put_contents('users.json', json_encode($users, JSON_PRETTY_PRINT));

        header('Location: login.php');
    }
}
?>
