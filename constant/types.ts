const TYPES = {
    Config: Symbol.for("Config"),
    MongoDBClient: Symbol.for('MongoDBClient'),
    UserService: Symbol.for('UserService'),
    InspectionService: Symbol.for('InspectionService'),
    ViolationService: Symbol.for('ViolationService'),
    VehicleService: Symbol.for('VehicleService'),
    ReportService: Symbol.for('ReportService'),
};

export default TYPES;
