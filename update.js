const { MongoClient } = require('mongodb');

async function main() {
    
    const uri = "mongodb+srv://mitul:mitul@02@cluster0.ownzd.mongodb.net/crud";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await findListingByName(client, "Infinite Views");
        await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });
        await findListingByName(client, "Infinite Views");

        await findListingByName(client, "Cozy Cottage");
        await upsertListingByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, bathrooms: 1 });
        await findListingByName(client, "Cozy Cottage");
        await upsertListingByName(client, "Cozy Cottage", { beds: 2 });
        await findListingByName(client, "Cozy Cottage");

        await updateAllListingsToHavePropertyType(client);
        await findListingByName(client, "Cozy Cottage");

    } finally {
        await client.close();
    }
}

main().catch(console.error);

/**
 * @param {MongoClient} client 
 * @param {string} nameOfListing 
 * @param {object} updatedListing 
 */
async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

/** 
 * @param {MongoClient} client 
 * @param {string} nameOfListing 
 * @param {object} updatedListing 
 */
async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("crud").collection("Tasks").updateOne({ name: nameOfListing }, { $set: updatedListing }, { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

/**
 * @param {MongoClient} client 
 */
async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("crud").collection("Tasks").updateMany({ property_type: { $exists: false } }, { $set: { property_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

/**
 
 * @param {MongoClient} client 
 * @param {String} nameOfListing 
 */
async function findListingByName(client, nameOfListing) {
    const result = await client.db("crud").collection("Tasks").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the db with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
