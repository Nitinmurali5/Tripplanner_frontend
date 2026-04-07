const { MongoClient } = require('mongodb');

async function checkCollections() {
  const localUri = 'mongodb://localhost:27017';
  const client = new MongoClient(localUri);

  try {
    await client.connect();
    const targetDbs = ['supersync', 'test', 'admin', 'local']; // testing common names or the ones from previous list

    for (const dbName of targetDbs) {
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      console.log(`Database: ${dbName}`);
      collections.forEach(col => console.log(` - ${col.name}`));
    }
  } catch (err) {
    console.error('Error connecting to local MongoDB:', err.message);
  } finally {
    await client.close();
  }
}

checkCollections();
