require('dotenv').config();
const { pool } = require('./db/dbConfig');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✅' : 'NOT SET ❌');
    
    const result = await pool.query('SELECT NOW(), current_database(), current_user');
    const { now, current_database, current_user } = result.rows[0];
    
    console.log('✅ Connection successful!');
    console.log('⏰ Server time:', now);
    console.log('🗄️  Database:', current_database);
    console.log('👤 User:', current_user);
    
    // Test that we can access lookbook tables
    const tables = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'lookbook_%'
      ORDER BY tablename
    `);
    
    console.log('\n📊 Lookbook Tables Found:', tables.rows.length);
    tables.rows.forEach(row => console.log('  -', row.tablename));
    
    // Check record counts
    const profileCount = await pool.query('SELECT COUNT(*) FROM lookbook_profiles');
    const projectCount = await pool.query('SELECT COUNT(*) FROM lookbook_projects');
    const skillsCount = await pool.query('SELECT COUNT(*) FROM lookbook_skills');
    const industriesCount = await pool.query('SELECT COUNT(*) FROM lookbook_industries');
    
    console.log('\n📈 Record Counts:');
    console.log('  - Profiles:', profileCount.rows[0].count);
    console.log('  - Projects:', projectCount.rows[0].count);
    console.log('  - Skills:', skillsCount.rows[0].count);
    console.log('  - Industries:', industriesCount.rows[0].count);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check that backend/.env has DATABASE_URL set');
    console.error('2. Verify the connection string is correct');
    console.error('3. See DATABASE_CONFIG.md for detailed help');
    process.exit(1);
  }
}

testConnection();

