const { model, Schema, Types } = require('mongoose')

// specifying _id as false  tells mongoose not to create an objectID

const Position = Schema({
    begin: Object,
    _id: false
})
const Location = Schema({
    path: String,
    positions: Position,
    _id: false
})

const Metadata = Schema({
    description: String,
    severity: String
})


const Findings = Schema({
    type: String,
    ruleId: String,
    location: Location,
    metadata: Metadata,
    _id: false
})

const schema = Schema({
    id: Types.ObjectId,
    status: {
        enum: ["Queued", "In Progress", "Success", "Failure"],
        type: String
    },
    repositoryName: String,
    findings: { type: [Findings], default: [] },
    queuedAt: Date,
    scanningAt: Date,
    finishedAt: Date
})

const ScanResultsModel = model("ScanResults", schema)

module.exports = { ScanResultsModel }