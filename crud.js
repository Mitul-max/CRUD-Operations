const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://mitul:mitul@02@cluster0.ownzd.mongodb.net/crud";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        await ListDataBases();
    } finally {
        await client.close();
    }
}

main().catch(console.error);
