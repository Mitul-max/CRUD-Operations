const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://mitul:mitul@02@cluster0.ownzd.mongodb.net/crud";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        await printIfListingExists(client, "Cozy Cottage");
        
        await deleteListingByName(client, "Cozy Cottage");
       
        await printIfListingExists(client, "Cozy Cottage");

        
        await printIfListingExists(client, "Ribeira Charming Duplex");
        await printIfListingExists(client, "Horto flat with small garden");
        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));
        await printIfListingExists(client, "Ribeira Charming Duplex");
        await printIfListingExists(client, "Horto flat with small garden");

    } finally {
        await client.close();
    }
}

main().catch(console.error);

/**
 * @param {MongoClient} client 
 * @param {string} nameOfListing 
 */
async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("crud").collection("Taks").deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/**
 * @param {MongoClient} client 
 * @param {Date} date 
 */
async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("crud").collection("Tasks").deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/**
 * @param {MongoClient} client 
 * @param {String} nameOfListing 
 */
async function printIfListingExists(client, nameOfListing) {
    const result = await client.db("crud").collection("Tasks").findOne({ name: nameOfListing });

    if (result) {
        if (result.last_scraped) {
            console.log(`Found a listing in the collection with the name '${nameOfListing}'. Listing was last scraped ${result.last_scraped}.`);
        } else {
            console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
        }
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
