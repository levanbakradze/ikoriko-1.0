// upload-to-algolia.js (Version 3 - Final Fix)

const path = require('path');
const algoliasearch = require('algoliasearch');

async function uploadToAlgolia() {
  try {
    console.log("Starting Algolia sync process...");

    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
      throw new Error("Algolia credentials are not set in GitHub Secrets.");
    }
    console.log("Algolia credentials found.");

    const dbPath = path.resolve(__dirname, 'products', 'database.js');
    console.log(`Attempting to load database from: ${dbPath}`);
    
    const { productsDatabase } = require(dbPath);
    if (!productsDatabase) {
        throw new Error("Failed to load 'productsDatabase' from database.js.");
    }
    console.log("Successfully loaded product database.");

    // --- FIX for "algoliasearch is not a function" ---
    // This handles different ways the library might be exported.
    const initClient = algoliasearch.default || algoliasearch;

    // Initialize the client using the corrected function
    const client = initClient(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    const indexName = 'ikoriko_products';
    const index = client.initIndex(indexName);
    console.log(`Successfully connected to Algolia index '${indexName}'.`);

    const allProducts = Object.values(productsDatabase).flat();
    const records = allProducts.map(product => ({
      ...product,
      objectID: product.id.toString()
    }));
    console.log(`Prepared ${records.length} product records for upload.`);

    if (records.length === 0) {
        console.log("No records to upload. Skipping sync.");
        return;
    }

    console.log("Clearing existing index to ensure a clean sync...");
    await index.clearObjects();
    
    console.log("Uploading new records to Algolia...");
    const { objectIDs } = await index.saveObjects(records);
    
    console.log(`\n✅ Successfully uploaded ${objectIDs.length} records to Algolia!`);

  } catch (error) {
    console.error("\n❌ Error during Algolia sync process:");
    console.error(error);
    process.exit(1); 
  }
}

uploadToAlgolia();
