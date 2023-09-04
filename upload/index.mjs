import { ExtractInspections } from "./xml_data.mjs";
import { MongoClient } from 'mongodb';

// CONFIG
const url = 'mongodb+srv://u0:GuBCHfJV54RVyY4M@cluster0.8vjcbyf.mongodb.net/?retryWrites=true&w=majority'
const filename = "./USDOT_80806_All_BASICs_Public_07-28-2023.xml";

const data = ExtractInspections(filename);
// console.log(
//     data.vehicles.length,
//     data.inspections.length,
//     data.violations.length,
// );

// console.log(data.violations.slice(0, 2));

// unit type: 1, 2, D
// violations: array
// basic is from violation summary

/******************************************** */
// INSERT TO DB
const client = new MongoClient(url);
await client.connect();
console.log("connected to db");
const db = client.db('dot_inspection');

const insertMany = async (col_name, records, indexes) => {
    try {
        const col = db.collection(col_name);
        await col.insertMany(
            records,
            { ordered: false }
        );
        await col.createIndex(indexes)
        return records.length;
    } catch (e) {
        if (e.code == 11000) {
            // ignore
            return e.result.insertedCount;;
        }
        console.log(e);
        return 0;
    }
}

console.log(data.summary)

await insertMany('inspections', data.inspections, [['vins'], ['date', -1]]);
await insertMany('vehicles', data.vehicles, [['license_number']]);
await insertMany('violations', data.violations, [['vin']]);
await insertMany('summary', data.summary, [['code']]);

process.exit(0);
