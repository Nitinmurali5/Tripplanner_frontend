const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrateData() {
  const localUri = 'mongodb://localhost:27017';
  const atlasUri = process.env.MONGODB_URI;

  if (!atlasUri) {
    console.error('Error: MONGODB_URI not found in .env');
    return;
  }

  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);

  try {
    console.log('Connecting to Local MongoDB...');
    await localClient.connect();
    console.log('Connecting to Atlas MongoDB...');
    await atlasClient.connect();

    const localDb = localClient.db('supersync');
    const atlasDb = atlasClient.db(); // Uses DB specified in URI (TripPlanner)

    const collections = await localDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections in 'supersync'`);

    for (const collection of collections) {
      const colName = collection.name;
      console.log(`Migrating collection: ${colName}...`);

      const documents = await localDb.collection(colName).find({}).toArray();
      
      if (documents.length > 0) {
        // Clear destination collection first if needed, or just insert
        // await atlasDb.collection(colName).deleteMany({}); 
        
        const result = await atlasDb.collection(colName).insertMany(documents);
        console.log(` - Successfully migrated ${result.insertedCount} documents.`);
      } else {
        console.log(` - Collection ${colName} is empty, skipping.`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

migrateData();
