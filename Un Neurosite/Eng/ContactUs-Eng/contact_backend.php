<?php
// Database configuration
$host = 'localhost';
$dbname = 'neurobotix_contact';
$username = 'root';
$password = '';

// Email configuration
$to_email = 'ftc.neurobotix@gmail.com';
$from_email = 'noreply@neurobotix.com';
$from_name = 'Neurobotix Contact Form';

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('No data received');
    }
    
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $message = trim($input['message'] ?? '');
    
    // Validate input
    if (empty($name) || empty($email) || empty($message)) {
        throw new Exception('All fields are required');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Connect to database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create table if it doesn't exist
    $createTable = "CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($createTable);
    
    // Insert message into database
    $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, message, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $name,
        $email,
        $message,
        $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
    ]);
    
    // Prepare email content
    $subject = "New Contact Form Message from $name";
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9370db, #8a2be2); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #9370db; }
            .value { margin-left: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📧 New Contact Form Message</h2>
                <p>Someone has sent you a message through the Neurobotix website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>👤 Name:</span>
                    <span class='value'>$name</span>
                </div>
                <div class='field'>
                    <span class='label'>📧 Email:</span>
                    <span class='value'>$email</span>
                </div>
                <div class='field'>
                    <span class='label'>💬 Message:</span>
                    <div class='value' style='margin-top: 10px; background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #9370db;'>$message</div>
                </div>
                <div class='field'>
                    <span class='label'>🌐 IP Address:</span>
                    <span class='value'>" . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>⏰ Time:</span>
                    <span class='value'>" . date('Y-m-d H:i:s') . "</span>
                </div>
            </div>
            <div class='footer'>
                <p>This message was sent automatically from the Neurobotix contact form</p>
                <p>You can reply directly to: $email</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $from_name . ' <' . $from_email . '>',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Send email
    $mailSent = mail($to_email, $subject, $emailBody, implode("\r\n", $headers));
    
    if (!$mailSent) {
        throw new Exception('Failed to send email notification');
    }
    
    // Send auto-reply to user
    $userSubject = "Thank you for contacting Neurobotix!";
    $userBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9370db, #8a2be2); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>🤖 Thank you for contacting Neurobotix!</h2>
            </div>
            <div class='content'>
                <p>Dear <strong>$name</strong>,</p>
                <p>Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <div style='background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #9370db; margin: 15px 0;'>$message</div>
                <p>We typically respond within 24-48 hours during business days.</p>
                <p>Best regards,<br><strong>The Neurobotix Team</strong></p>
            </div>
            <div class='footer'>
                <p>This is an automated response. Please do not reply to this email.</p>
                <p>For urgent matters, please contact us directly.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $userHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $from_name . ' <' . $from_email . '>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    mail($email, $userSubject, $userBody, implode("\r\n", $userHeaders));
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully! We\'ll get back to you soon.',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
