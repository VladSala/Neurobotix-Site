<?php
session_start();

// Database configuration
$host = 'localhost';
$dbname = 'neurobotix_contact';
$username = 'root';
$password = '';

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in'])) {
    // Handle login
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
        $input_username = $_POST['username'];
        $input_password = $_POST['password'];
        
        try {
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
            $stmt->execute([$input_username]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($input_password, $user['password_hash'])) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_username'] = $user['username'];
                
                // Update last login
                $stmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                $stmt->execute([$user['id']]);
            } else {
                $error = "Invalid username or password";
            }
        } catch (Exception $e) {
            $error = "Database error: " . $e->getMessage();
        }
    }
    
    // Show login form if not logged in
    if (!isset($_SESSION['admin_logged_in'])) {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Neurobotix Admin Login</title>
            <style>
                body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; margin: 0; padding: 20px; }
                .login-container { max-width: 400px; margin: 100px auto; background: #2a2a2a; padding: 40px; border-radius: 15px; }
                .logo { text-align: center; margin-bottom: 30px; }
                .form-group { margin-bottom: 20px; }
                label { display: block; margin-bottom: 5px; color: #9370db; }
                input[type="text"], input[type="password"] { width: 100%; padding: 12px; border: 1px solid #444; border-radius: 8px; background: #333; color: white; box-sizing: border-box; }
                .login-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #9370db, #8a2be2); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
                .login-btn:hover { background: linear-gradient(135deg, #8a2be2, #9370db); }
                .error { color: #ff6b6b; text-align: center; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <div class="logo">
                    <h2>🤖 Neurobotix Admin</h2>
                    <p>Contact Form Management</p>
                </div>
                
                <?php if (isset($error)): ?>
                    <div class="error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <form method="POST">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" name="login" class="login-btn">Login</button>
                </form>
                
                <div style="text-align: center; margin-top: 20px; color: #888;">
                    <p>Default: admin / admin123</p>
                </div>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

// User is logged in, show admin panel
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get messages
    $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    $messages = $stmt->fetchAll();
    
    // Handle logout
    if (isset($_GET['logout'])) {
        session_destroy();
        header('Location: admin_panel.php');
        exit;
    }
    
} catch (Exception $e) {
    $error = "Database error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neurobotix Admin Panel</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #9370db; }
        .logout-btn { padding: 10px 20px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 8px; }
        .logout-btn:hover { background: #ff5252; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #2a2a2a; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #9370db; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #9370db; }
        .messages-table { background: #2a2a2a; border-radius: 10px; overflow: hidden; }
        .table-header { background: #9370db; padding: 15px; font-weight: bold; }
        .message-row { padding: 15px; border-bottom: 1px solid #444; }
        .message-row:hover { background: #333; }
        .message-row:nth-child(even) { background: #2f2f2f; }
        .message-row:nth-child(even):hover { background: #333; }
        .message-preview { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .timestamp { color: #888; font-size: 0.9rem; }
        .no-messages { text-align: center; padding: 40px; color: #888; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>🤖 Neurobotix Admin Panel</h1>
            <p>Welcome, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</p>
        </div>
        <a href="?logout=1" class="logout-btn">Logout</a>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number"><?php echo count($messages); ?></div>
            <div>Total Messages</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo count(array_filter($messages, function($m) { return strtotime($m['created_at']) > strtotime('-24 hours'); })); ?></div>
            <div>Last 24 Hours</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo count(array_filter($messages, function($m) { return strtotime($m['created_at']) > strtotime('-7 days'); })); ?></div>
            <div>Last 7 Days</div>
        </div>
    </div>
    
    <div class="messages-table">
        <div class="table-header">
            Contact Form Messages
        </div>
        
        <?php if (empty($messages)): ?>
            <div class="no-messages">
                <h3>No messages yet</h3>
                <p>When someone submits the contact form, their message will appear here.</p>
            </div>
        <?php else: ?>
            <?php foreach ($messages as $message): ?>
                <div class="message-row">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 2fr 1fr; gap: 20px; align-items: center;">
                        <div>
                            <strong><?php echo htmlspecialchars($message['name']); ?></strong>
                            <div class="timestamp"><?php echo htmlspecialchars($message['email']); ?></div>
                        </div>
                        <div class="message-preview" title="<?php echo htmlspecialchars($message['message']); ?>">
                            <?php echo htmlspecialchars(substr($message['message'], 0, 100)); ?>...
                        </div>
                        <div class="timestamp">
                            IP: <?php echo htmlspecialchars($message['ip_address']); ?>
                        </div>
                        <div class="timestamp">
                            <?php echo date('M j, Y g:i A', strtotime($message['created_at'])); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>
