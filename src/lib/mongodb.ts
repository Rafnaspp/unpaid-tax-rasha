import mongoose from 'mongoose';



declare global {

  var mongoose: any;

}



const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taxtrackerDB';



if (!MONGODB_URI) {

  throw new Error('Please define the MONGODB_URI environment variable inside .env');

}



let cached = global.mongoose;



if (!cached) {

  cached = global.mongoose = { conn: null, promise: null };

}



async function connectDB() {

  if (cached.conn) {

    return cached.conn;

  }



  if (!cached.promise) {

    const opts = {

      bufferCommands: false,

      maxPoolSize: 10,

    };



    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {

      return mongoose;

    });

  }



  try {

    cached.conn = await cached.promise;

  } catch (e) {

    cached.promise = null;

    throw e;

  }



  return cached.conn;

}



export default connectDB;

