// upload-to-algolia.js (Version 2 - with better error handling)

// This script reads your local product database and uploads it to your Algolia index.

// 1. --- SETUP ---
// We need 'path' to correctly locate your database file, no matter where the script is run from.
const path = require('path');
// We need the 'algoliasearch' library to talk to Algolia.
const algoliasearch = require('algoliasearch');

// 2. --- MAIN LOGIC ---
// We wrap the main logic in an async function to handle the upload process.
async function uploadToAlgolia() {
  try {
    console.log("Starting Algolia sync process...");

    // --- Check for Secrets ---
    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
      throw new Error("Algolia credentials are not set. Make sure ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY are configured in GitHub Secrets.");
    }
    console.log("Algolia credentials found.");

    // --- Load Product Data ---
    // Create a reliable path to your database file.
    const dbPath = path.resolve(__dirname, 'products', 'database.js');
    console.log(`Attempting to load database from: ${dbPath}`);
    
    // We load your product data from your existing database file.
    const { productsDatabase } = require(dbPath);
    if (!productsDatabase) {
        throw new Error("Failed to load 'productsDatabase' from database.js. Check if the variable is defined and exported correctly.");
    }
    console.log("Successfully loaded product database.");

    // --- Connect to Algolia ---
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // --- Initialize the Index ---
    // IMPORTANT: Double-check that 'ikoriko_products' is your exact Algolia index name.
    const indexName = 'ikoriko_products';
    const index = client.initIndex(indexName);
    console.log(`Successfully connected to Algolia index '${indexName}'.`);

    // --- Prepare the Data ---
    // Combine all product categories into one single array.
    const allProducts = Object.values(productsDatabase).flat();

    // Algolia requires each item to have a unique 'objectID'.
    const records = allProducts.map(product => ({
      ...product,
      objectID: product.id.toString() // Ensure objectID is a string
    }));
    console.log(`Prepared ${records.length} product records for upload.`);

    if (records.length === 0) {
        console.log("No records to upload. Skipping sync.");
        return;
    }

    // --- Upload the Data ---
    console.log("Clearing existing index to ensure a clean sync...");
    await index.clearObjects(); // Clear the index before uploading new data
    
    console.log("Uploading new records to Algolia...");
    const { objectIDs } = await index.saveObjects(records);
    
    console.log(`\n✅ Successfully uploaded ${objectIDs.length} records to Algolia!`);

  } catch (error) {
    // If anything goes wrong, we log the error to the console.
    console.error("\n❌ Error during Algolia sync process:");
    console.error(error);
    // Exit with an error code to make the GitHub Action fail.
    process.exit(1); 
  }
}

// 3. --- RUN THE SCRIPT ---
uploadToAlgolia();
