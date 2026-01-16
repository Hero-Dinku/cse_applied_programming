// test-connection-enhanced.js
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...');
    console.log('URI length:', process.env.MONGODB_URI?.length || 'Not found');
    
    // Try different connection options
    const options = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4 // Force IPv4
    };
    
    try {
        // Test 1: Basic connection
        console.log('\n1. Testing basic connection...');
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('✅ Basic connection successful!');
        
        // Test 2: Database operations
        console.log('\n2. Testing database operations...');
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Collections found:', collections.length);
        
        // Test 3: Create a test document
        console.log('\n3. Creating test document...');
        const testCollection = db.collection('test_cse310');
        await testCollection.insertOne({
            test: 'CSE 310 Project',
            timestamp: new Date(),
            student: 'Dinku'
        });
        console.log('✅ Test document created!');
        
        // Test 4: Read it back
        const docs = await testCollection.find({}).toArray();
        console.log('Documents in test collection:', docs.length);
        
        // Clean up
        await testCollection.drop();
        console.log('✅ Test collection cleaned up');
        
        await mongoose.disconnect();
        console.log('\n🎉 ALL TESTS PASSED! MongoDB is working correctly.');
        
    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.log('\nTROUBLESHOOTING:');
        console.log('1. Check password in MongoDB Atlas');
        console.log('2. Check IP whitelisting (add 0.0.0.0/0 temporarily)');
        console.log('3. Check if cluster is running (might be paused)');
        console.log('4. Try creating a NEW database user');
        
        if (error.message.includes('Authentication failed')) {
            console.log('\n🔐 AUTHENTICATION ERROR: Password is wrong or user doesn\'t exist');
        }
        if (error.message.includes('getaddrinfo')) {
            console.log('\n🌐 NETWORK ERROR: Check your internet connection');
        }
    }
}

testConnection();
