const {MongoClient} = require('mongodb');

async function main(){
    const uri = "mongodb+srv://mitul:mitul@02@cluster0.ownzd.mongodb.net/crud";
   
    const client = new MongoClient(uri);

    try {
        
        await client.connect();
        await createListing(client,
            {
                Description: "A charming loft in Paris",
                Completed: "False"
            }
        );
        await createMultipleListings(client, [
            {
                Description: "Infinite Views",
                Completed: "True"
            },
            {
                Description: "Private room in London",
                Completed: "False"
            },
            {
                Description: "Beautiful Beach House",
                Completed: "True"
            }
        ]);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

/**
  @param {MongoClient} client 
  @param {Object} newListing 
*/
async function createListing(client, newListing){
    const result = await client.db("crud").collection("Tasks").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

/**
 
 @param {MongoClient} client 
 @param {Object[]} newListings 
 */
async function createMultipleListings(client, newListings){
    const result = await client.db("crud").collection("Tasks").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}