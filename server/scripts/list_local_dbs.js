const { MongoClient } = require('mongodb');

async function listDatabases() {
  const localUri = 'mongodb://localhost:27017';
  const client = new MongoClient(localUri);

  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log('Local Databases:');
    dbs.databases.forEach(db => console.log(` - ${db.name}`));
  } catch (err) {
    console.error('Error connecting to local MongoDB:', err.message);
  } finally {
    await client.close();
  }
}

listDatabases();
