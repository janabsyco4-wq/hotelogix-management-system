const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath);

async function updateDatabase() {
    console.log('🔧 Updating database schema...');

    // Add password column to User table
    db.run(`ALTER TABLE User ADD COLUMN password TEXT`, async (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding password column:', err);
            return;
        }

        console.log('✅ Password column added');

        // Hash passwords
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);

        // Update existing users with passwords
        db.run(`UPDATE User SET password = ? WHERE email = ?`, [adminPassword, 'admin@stoneycreek.com'], (err) => {
            if (err) console.error('Error updating admin:', err);
            else console.log('✅ Admin password set');
        });

        db.run(`UPDATE User SET password = ? WHERE email = ?`, [userPassword, 'john@example.com'], (err) => {
            if (err) console.error('Error updating user:', err);
            else console.log('✅ User password set');

            console.log('\n========================================');
            console.log('Database updated successfully!');
            console.log('========================================\n');
            console.log('Login credentials:');
            console.log('  Admin: admin@stoneycreek.com / admin123');
            console.log('  User:  john@example.com / user123\n');

            db.close();
        });
    });
}

updateDatabase().catch(console.error);
