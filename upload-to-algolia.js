// upload-to-algolia.js

// This script reads your local product database and uploads it to your Algolia index.

// 1. --- SETUP ---
// We need the 'algoliasearch' library to talk to Algolia.
const algoliasearch = require('algoliasearch');
// We load your product data from your existing database file.
const { productsDatabase } = require('./products/database.js');

// 2. --- MAIN LOGIC ---
// We wrap the main logic in an async function to handle the upload process.
async function uploadToAlgolia() {
  try {
    console.log("Starting Algolia sync process...");

    // --- Connect to Algolia ---
    // Securely get your App ID and Admin API Key from the environment variables
    // provided by the GitHub Actions workflow.
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    // --- Initialize the Index ---
    // Tell the client which index you want to work with.
    // IMPORTANT: Replace 'ikoriko_products' with your actual Algolia index name.
    const index = client.initIndex('ikoriko_products');
    console.log("Successfully connected to Algolia index 'ikoriko_products'.");

    // --- Prepare the Data ---
    // Your database.js has products in categories (gym, armwrestling, etc.).
    // We need to combine them into one single array for Algolia.
    const allProducts = Object.values(productsDatabase).flat();

    // Algolia requires each item to have a unique 'objectID'.
    // We'll map over your products and use your existing 'id' for this.
    const records = allProducts.map(product => ({
      ...product,
      objectID: product.id.toString() // Ensure objectID is a string
    }));
    console.log(`Prepared ${records.length} product records for upload.`);

    // --- Upload the Data ---
    // The 'saveObjects' method will add or update all records in the index.
    // It's smart enough to replace existing items based on their objectID.
    console.log("Uploading records to Algolia...");
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
// Call the main function to start the process.
uploadToAlgolia();
