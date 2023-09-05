# haul_software_engineer

## Try it
- `npm install` then `npm start`

## Configuraton
- Rename `config.example.json` to `config.json` 
- Update the DB information as needed

## Init the database
- The accepted raw data is xml files downloaded from https://ai.fmcsa.dot.gov/SMS/Carrier/80806/CompleteProfile.aspx
- See `upload/index.mjs` on how the processing works

## APIs

### List inspection
```sh
curl 'http://127.0.0.1:3000/inspection?page_size=100&page_number=1&sort_by=date&sort_order=asc&basic=Unsafe Driving'
```

### Get Inspection

```sh
curl http://127.0.0.1:3000/inspection/CT3075000273
```
