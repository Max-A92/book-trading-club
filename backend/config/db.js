const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('═══════════════════════════════════════');
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database Host: ${conn.connection.host}`);
    console.log(`💾 Database Name: ${conn.connection.name}`);
    console.log('═══════════════════════════════════════');
  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ MongoDB Connection Error:');
    console.error(error.message);
    console.error('═══════════════════════════════════════');
    process.exit(1); 
  }

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB Disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Error:', err);
  });
};

module.exports = connectDB;