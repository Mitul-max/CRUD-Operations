const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://mitul:mitul@02@cluster0.ownzd.mongodb.net/crud";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await findOneListingByName(client, "Infinite Views");

        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });

    } finally {
        await client.close();
    }
}

main().catch(console.error);

/**
 * @param {MongoClient} client 
 * @param {String} nameOfListing
 */
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("crud").collection("Tasks").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

/**
 
 * @param {MongoClient} client 
 * @param {object} queryParams 
 * @param {number} queryParams.minimumNumberOfBedrooms 
 * @param {number} queryParams.minimumNumberOfBathrooms 
 * @param {number} queryParams.maximumNumberOfResults 
 */
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {

    const cursor = client.db("crud").collection("Tasks")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms }
        }
        )
        .sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

  
    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}
