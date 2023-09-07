import { ExtractInspections } from "./xml_data.mjs";
import { MongoClient } from 'mongodb';

// CONFIG
const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;
const filename = "./USDOT_80806_All_BASICs_Public_07-28-2023.xml";

const data = ExtractInspections(filename);

// console.log(data.violations.slice(0, 2));

// unit type: 1, 2, D
// violations: array
// basic is from violation summary

/******************************************** */
// INSERT TO DB
const client = new MongoClient(db_url);
await client.connect();
console.log("connected to db");
const db = client.db(db_name);

try {
    const col = db.collection("inspections");
    
    await col.createIndex({ date: 1 });
    await col.createIndex({ no: 1 });
    await col.createIndex({ 'violation.basic': 1 });

    const records = data;
    await col.insertMany(
        records,
        { ordered: false }
    );
} catch (e) {
    if (e.code == 11000) {
        // ignore
        console.log(e.result.insertedCount);
    } else {
        console.log(e);
    }
}

process.exit(0);
