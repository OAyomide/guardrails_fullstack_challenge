const { ScanResultsModel } = require('../models/ScanResult')
const { Error: MongooseError } = require('mongoose')
async function CreateScanResult(request, response) {
  try {
    const { _id, status, repositoryName, findings, queuedAt, scanningAt, finishedAt } = request.body

    // create the record
    const newScan = await ScanResultsModel.create({
      _id, status, repositoryName, findings, queuedAt, scanningAt, finishedAt
    })
    response.status(201).json({ message: "new ScanResult created", data: newScan })
  } catch (e) {
    console.log(e)
    return response.status(500).json({ message: "Internal Server Error" })
  }
}

async function FindScanResult(request, response) {
  try {
    if (!request.params.id) {
      return request.status(400).json({ message: "Bad request. Scan ID not supplied" })
    }
    const { id } = request.params
    // find in the DB
    let scanResult = await ScanResultsModel.findById(id)
    if (!scanResult) {
      return response.status(404).json({ message: "Resource not found." })
    }
    return response.status(200).json({ message: "Resource found", data: scanResult })

  } catch (e) {
    if (e instanceof MongooseError.CastError) {
      return response.status(409).json({ message: "Invalid ScanResult ID." })
    }

    // console.log(e)
    response.status(500).json({ message: "Internal Server Error" })
  }
}


async function CountAllScanResults(request, response) {
  try {
    let { limit, skip } = request.query
    let count = await ScanResultsModel.countDocuments()
    let result = await ScanResultsModel.find({}).limit(limit ? parseInt(limit, 10) : 100).skip(skip ? parseInt(skip, 10) : 0)
    return response.status(200).json({ message: "Resource found.", data: result, count: count })

  } catch (e) {
    return response.status(500).json({ message: "Internal Server Error" })
  }
}

async function UpdateScanResult(request, response) {
  try {
    if (Object.keys(request.body).length === 0 || !request.params) {
      return response.status(400).json({ message: "Bad request. No data to update or ScanResult ID passed." })
    }

    // find the user. then update
    const { id } = request.params
    const { body } = request

    // TODO: Update Findings too
    await ScanResultsModel.findByIdAndUpdate(id, body)
    return response.status(200).json({ message: "ScanResult updated" })

  } catch (e) {
    return response.status(500).json({ message: "Internal Server Error" })
  }
}

async function DeleteScanResult(request, response) {
  try {
    if (!request.params.id) {
      return response.status(400).json({ message: "Bad Request. ScanResult ID to delete not passed." })
    }

    const { id } = request.params
    await ScanResultsModel.findByIdAndDelete(id)
    return response.status(200).json({ message: "Resource removed" })

  } catch (e) {
    return response.status(500).json({ message: "Internal Server Error" })
  }
}

async function FindScanResultFindingsNumber(request, response) {
  try {
    if (!request.params.id) {
      return response.status(400).json({ message: "Bad Request. No ScanResult ID passed" })
    }

    const { id } = request.params
    // find the record. If found, check if it has findings. If it does, return the number
    let record = await ScanResultsModel.findById(id)
    if (!record._id) {
      return response.status(404).json({ message: "Resource not found." })
    }

    if (record.findings && record.findings.length > 0) {
      return response.status(200).json({ message: "Resource found", data: record.findings.length })
    }

    return response.status(404).json({ message: "ScanResult has no findings" })
  } catch (e) {
    return response.status(500).json({ message: "Internal Server Error" })
  }
}
module.exports = { CreateScanResult, FindScanResult, CountAllScanResults, UpdateScanResult, DeleteScanResult, FindScanResultFindingsNumber }