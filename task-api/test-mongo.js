// test-mongo.js (Updated for Mongoose 7+)
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');

// For Mongoose 7+, the options are different
const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
};

mongoose.connect(process.env.MONGODB_URI, options)
.then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB!');
    console.log('Database:', mongoose.connection.name);
    console.log('Mongoose version:', mongoose.version);
    
    // List collections
    return mongoose.connection.db.listCollections().toArray();
})
.then(collections => {
    console.log('Collections:', collections.map(c => c.name));
    mongoose.connection.close();
})
.catch(err => {
    console.error('❌ ERROR:', err.message);
    console.log('Full error:', err);
});
