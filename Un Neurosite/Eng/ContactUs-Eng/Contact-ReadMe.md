# 🚀 Neurobotix Contact Form Backend Setup

## 📋 **What This System Does:**

1. **Stores Messages** - Saves all contact form submissions to a MySQL database
2. **Sends Emails** - Automatically emails the Neurobotix team when someone submits the form
3. **Auto-Reply** - Sends a confirmation email back to the person who submitted the form
4. **Admin Panel** - View all messages in a secure admin interface

## 🛠️ **Setup Requirements:**

- **Web Server** (Apache/Nginx with PHP support)
- **MySQL Database** (or MariaDB)
- **PHP 7.4+** with PDO and mail() function enabled

## 📁 **Files Created:**

- `contact_backend.php` - Main backend script
- `Contact Database.sql` - Database setup script
- `admin_panel.php` - Admin interface to view messages
- `Contact-ReadMe.md` - This setup guide

## 🗄️ **Database Setup:**

1. **Create Database:**
   ```sql
   CREATE DATABASE neurobotix_contact;
   ```

2. **Run Setup Script:**
   ```bash
   mysql -u root -p neurobotix_contact < "Contact Database.sql"
   ```

3. **Or Import Manually:**
   - Open phpMyAdmin or your MySQL client
   - Select the `neurobotix_contact` database
   - Run the SQL commands from `Contact Database.sql`

## ⚙️ **Configuration:**

### **Database Settings** (in `contact_backend.php`):
```php
$host = 'localhost';           // Your database host
$dbname = 'neurobotix_contact'; // Database name
$username = 'root';            // Database username
$password = '';                // Database password
```

### **Email Settings** (in `contact_backend.php`):
```php
$to_email = 'ftc.neurobotix@gmail.com';  // Where to send notifications
$from_email = 'noreply@neurobotix.com';   // From email address
$from_name = 'Neurobotix Contact Form';   // From name
```

## 🔐 **Admin Access:**

- **URL:** `yourdomain.com/admin_panel.php`
- **Username:** `admin`
- **Password:** `admin123`

**⚠️ Change these credentials after first login!**

## 🧪 **Testing:**

1. **Submit the contact form** on your website
2. **Check your email** - you should receive a notification
3. **Check admin panel** - the message should appear there
4. **Check database** - verify the message was stored

## 📧 **Email Features:**

- **Professional HTML emails** with Neurobotix branding
- **Auto-reply to users** confirming their message was received
- **Detailed notifications** including IP address and timestamp
- **Reply-to header** so you can reply directly to the user

## 🚨 **Security Features:**

- **Input validation** and sanitization
- **SQL injection protection** with prepared statements
- **CSRF protection** in admin panel
- **Session-based authentication**
- **IP address logging** for security

## 🔧 **Troubleshooting:**

### **Emails Not Sending:**
- Check if `mail()` function is enabled in PHP
- Verify email server configuration
- Check spam folder

### **Database Connection Issues:**
- Verify database credentials
- Check if MySQL service is running
- Ensure database exists

### **Form Not Working:**
- Check browser console for JavaScript errors
- Verify file paths are correct
- Check PHP error logs

## 📱 **Mobile Responsive:**

- Admin panel works on all devices
- Contact form is already mobile-friendly
- Responsive email templates

## 🎨 **Customization:**

- **Colors:** Edit CSS variables in admin panel
- **Email templates:** Modify HTML in `contact_backend.php`
- **Form fields:** Add/remove fields in both HTML and PHP
- **Styling:** Update CSS to match your brand

## 🚀 **Ready to Use!**

Once setup is complete, your contact form will:
1. ✅ Store all messages in database
2. ✅ Send instant notifications to your team
3. ✅ Auto-reply to users
4. ✅ Provide secure admin access
5. ✅ Work on all devices

**Need help?** Check the troubleshooting section or verify your server configuration!
