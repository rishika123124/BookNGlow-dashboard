import mongoose from 'mongoose';

// Prioritize .env.local over .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booknglow';

console.log('MongoDB Connection Debug:');
console.log('MONGODB_URI from environment:', MONGODB_URI ? 'Found' : 'Not found');
console.log('Database name from URI:', MONGODB_URI.split('/').pop() || 'Unknown');

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection to:', MONGODB_URI);
    // Optimized connection options
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully to database:', cached.conn.connection.name);
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

// Add connectToDatabase function for compatibility
async function connectToDatabase() {
  try {
    const connection = await connectDB();
    const dbName = connection.connection.name;
    console.log('Database connection established to:', dbName);
    return {
      db: connection.connection.db,
      connection: connection,
      dbName: dbName
    };
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export default connectDB;
export { connectToDatabase };
