# haul_software_engineer

## Configuraton
- Rename `.env.example` to `.env` 
- Update the DB information as needed

## Try it
- `npm install` then `npm start`

## Folder structure
- `index.ts`: bootstrap the server
- `controller`:
    - `inspection.ts`: controller api declaration
- `infra`:
    - `mongodb.ts`: configure mongodb connection
- `models`:
    - `inspection.ts`: declare the `Inspection` interface
- `repo`:
    - `inspection.ts`: fetch and format Inspection data 
- `upload`: a tool for loading XML files to the database
- `constant`:
    - `collection.ts`: list of mongodb collection names
    - `config.ts`: get application config
    - `types.ts`: decalre injectable tokens

## Upload files to the database
- The accepted raw data is xml files downloaded from https://ai.fmcsa.dot.gov/SMS/Carrier/80806/CompleteProfile.aspx
- See `upload/index.mjs` on how the processing works

## APIs

### List inspection
```sh
curl 'http://127.0.0.1:3000/inspection?page_size=100&page_number=1&sort_by=date&sort_order=asc&basic=Unsafe Driving'
```

Sample response:

```json
{
	"data": [
		{
			"no": "GA1391000003",
			"date": "2022-07-19T00:00:00.000Z",
			"plate": "2699061",
			"weight": 1,
			"basic": "HOS Compliance"
		},
		{
			"no": "MD0103002673",
			"date": "2021-07-28T00:00:00.000Z",
			"plate": "2836742",
			"weight": 1
		}
	],
	"meta": {
		"count": 28651,
		"page_size": 2,
		"page_number": 138,
		"sort_by": "plate",
		"sort_order": 1
	}
}
``````

### Get Inspection

```sh
curl http://127.0.0.1:3000/inspection/CT3075000273
```
Sample response 
```json
{
	"no": "GA1425000279",
	"date": "2023-07-25T00:00:00.000Z",
	"state": "GA",
	"level": 1,
	"hm": false,
	"phm": false,
	"weight": 3,
	"vehicles": [
		{
			"vin": "3AKJHLDR9PSMY0942",
			"license_state": "IN",
			"license_number": "3203369",
			"type": "Truck Tractor",
			"unit": 1
		},
		{
			"vin": "5JYLP4025PPP25050",
			"license_state": "IN",
			"license_number": "PB97577",
			"type": "Crib Log Trailer",
			"unit": 2
		}
	],
	"violations": [
		{
			"code": "396.3A1BL",
			"oos": false,
			"unit": "1",
			"basic": "Vehicle Maint.",
			"description": "Brake system pressure loss",
			"cdc": false
		},
		{
			"code": "396.17(c)",
			"oos": false,
			"unit": "1",
			"basic": "Vehicle Maint.",
			"description": "Operating a CMV without proof of a periodic inspection",
			"cdc": false
		},
		{
			"code": "393.104(b)",
			"oos": false,
			"unit": "2",
			"basic": "Vehicle Maint.",
			"description": "Damaged securement system/tiedowns",
			"cdc": false
		},
		{
			"code": "396.3(a)1BOS",
			"oos": false,
			"unit": "2",
			"basic": "Vehicle Maint.",
			"description": "BRAKES OUT OF SERVICE: The number of defective brakes is equal to or greater than 20 percent of the service brakes on the vehicle or combination",
			"cdc": false
		},
		{
			"code": "393.48(a)",
			"oos": false,
			"unit": "2",
			"basic": "Vehicle Maint.",
			"description": "Inoperative/defective brakes",
			"cdc": false
		},
		{
			"code": "393.45DLUV",
			"oos": false,
			"unit": "2",
			"basic": "Vehicle Maint.",
			"description": "Brake Connections with Leaks Under Vehicle",
			"cdc": false
		}
	]
}
```
