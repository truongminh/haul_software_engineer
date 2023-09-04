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
    const vehicleMap = new Map();
    const violationList = [];
    const summaryList = [];
    for (const d of data) {
        const { vehicles, violations, ...ins } = d;
        inspections.push(ins);
        vehicles.forEach(v => vehicleMap.set(v._id, v));
        if (violations) {
            for (const v of violations) {
                v.ins = ins._id;
                const vehicle = vehicles.find(ve => ve.unit == v.unit) || vehicles[0];
                v.vin = vehicle._id;
                v._id = `${v.ins}_${v.vin}`;
                violationList.push(v);

                if(v.basic){
                    summaryList.push({
                        code: v.code,
                        basic: v.basic,
                        description: v.description
                    })
                }
            }
        }
    }
    const vehicles = [...vehicleMap.values()];
    return { inspections, vehicles, violations: violationList, summary: summaryList };
}

export function ExtractViolationSumary(filename) {

}

/************************************************************************************** */
function makeVehicle(obj) {
    const _id = obj['@_vehicle_id_number'] || obj['@_license_number'];
    if (!_id) {
        return null;
    }
    const license_state = obj['@_license_state'];
    const license_number = obj['@_license_number'];
    const type = obj['@_unit_type'];
    const unit = +obj['@_unit'];
    return { _id, license_state, license_number, type, unit };
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
    return { code, oos, unit, basic, description };
}

function makeInspection(obj) {
    const date = new Date(obj['@_inspection_date']);
    const state = obj['@_report_state'];
    const _id = obj['@_report_number'];
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
    const vins = vehicles.map(v => v._id);
    return {
        _id, date, vins,
        state, level, weight, hm, phm,
        vehicles, violations,
    };
}
