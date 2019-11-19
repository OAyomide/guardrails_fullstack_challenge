const { assert } = require('chai')
const { ScanResultsModel } = require('../../src/models/ScanResult')
const { Types } = require('mongoose')

before(function (done) {
  this.timeout(0)
  ScanResultsModel.deleteMany()
    .then(res => {
      done()
    })
    .catch(err => {
      done(err)
    })
})


describe("ScanResult Model test suite", function () {
  this.timeout(0)
  it('Should assert ScanResult created in controller exits', async () => {
    let res = await ScanResultsModel.findOne({ repositoryName: "Test Repo 2" })
    let scanResult = res.repositoryName
    assert.equal(scanResult, "Test Repo 2")
  })

  it('Should assert the timestamp is finishedAt when the status if Success or failure', async () => {
    let res = await ScanResultsModel.findOne({ repositoryName: "Test Repo 2" })
    assert.exists(res.finishedAt)
    assert.equal(res.status, "Success")
  })
})