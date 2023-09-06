import { XMLParser } from 'fast-xml-parser';
import { readFileSync } from 'fs';

export function ExtractInspections(filename) {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    const raw = readFileSync(filename);
    const obj = parser.parse(raw);
    /** @type {Array} */
    const records = obj.carrierData.inspections.inspection || [];
    const data = records.map(makeInspection);
    const inspections = [];
    for (const d of data) {
        const { vehicles, violations, ...ins } = d;
        for (const violation of violations) {
            const vehicle = vehicles.find(ve => ve.unit == violation.unit) || vehicles[0];
            const inspection = { ...ins, vehicle, violation };
            inspections.push(inspection);
        }
        if (violations.length < 1) {
            const vehicle = vehicles[0];
            const inspection = { ...ins, vehicle, violation: null };
            inspections.push(inspection);
        }
    }
    return inspections;
}

/************************************************************************************** */
function makeVehicle(obj) {
    const vin = obj['@_vehicle_id_number'] || obj['@_license_number'];
    if (!vin) {
        return null;
    }
    const license_state = obj['@_license_state'];
    const license_number = obj['@_license_number'];
    const type = obj['@_unit_type'];
    const unit = +obj['@_unit'];
    return { vin, license_state, license_number, type, unit };
}

function makeViolation(obj) {
    const code = obj['@_code'];
    if (!code) {
        return null;
    }
    const oos = obj["@_oos"] == 'Yes';
    const unit = obj['@_unit'];
    const basic = obj['@_BASIC'];
    const description = obj['@_description']
    const cdc = obj['@_convicted_of_dif_charge'] == 'Y';
    return { code, oos, unit, basic, description, cdc };
}

function makeInspection(obj) {
    const date = new Date(obj['@_inspection_date']);
    const state = obj['@_report_state'];
    const no = obj['@_report_number'];
    const level = +obj['@_level'];
    const weight = +obj['@_time_weight'];
    const hm = obj['@_HM_inspection'] == 'Yes';
    const phm = obj['@_Placarable_HM_Veh_Insp'] == 'Yes';
    const vehicles = (obj.vehicles.vehicle || []).map(makeVehicle).filter(v => v);
    const violations = [];
    let violation = obj.violations.violation;
    if (violation) {
        if (!Array.isArray(violation)) {
            violation = [violation];
        }
        for (const v of violation) {
            const vi = makeViolation(v);
            if (vi) {
                violations.push(vi);
            }
        }
    }
    return {
        no, date,
        state, level, weight, hm, phm,
        vehicles, violations,
    };
}
