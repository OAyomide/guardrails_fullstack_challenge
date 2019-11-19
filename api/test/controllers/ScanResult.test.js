const { assert } = require('chai')
const { Types } = require("mongoose")
const request = require('supertest')
const app = require('../../index')

describe('ScanResult creation suite', function () {
  this.timeout(0)
  it('Should create a new ScanResult', () => {
    return request(app)
      .post("http://localhost:10000/api/scanresult/new")
      .send({
        "_id": new Types.ObjectId("5dcfa1944ce7c978698e1c49"),
        "status": "In Progress",
        "repositoryName": "Test Repo",
        "findings": {
          "type": "sampletype",
          "ruleId": "FG03",
          "location": {
            "path": "/src/parser.ts",
            "position": {
              "begin": {
                "line": "10"
              }
            }
          }
        },
        "queuedAt": "2019-11-15T18:33:40.416Z",
      })
      .expect(201)
      .then(response => assert.deepEqual(response.body.message, "new ScanResult created"))
  })

  it('Should create a new ScanResult', () => {
    return request(app)
      .post("http://localhost:10000/api/scanresult/new")
      .send({
        "_id": new Types.ObjectId("5dcfa1944ce7c978698e1c90"),
        "status": "Success",
        "repositoryName": "Test Repo 2",
        "findings": {
          "type": "sampletype",
          "ruleId": "AF19",
          "location": {
            "path": "/src/lexer.cpp",
            "position": {
              "begin": {
                "line": "1902"
              }
            }
          }
        },
        "finishedAt": "2019-11-15T18:33:40.416Z",
      })
      .expect(201)
      .then(response => assert.deepEqual(response.body.message, "new ScanResult created"))
  })
})

describe('ScanResult search suite', function () {
  this.timeout(0)
  it('Should return Not Found for unexistant id', async () => {
    return request(app)
      .get("http://localhost:10000/api/scanresult/5dcef1761392793a1ff031b8")
      .expect(404)
      .then(response => assert.equal(response.body.message, "Resource not found."))
  })

  it('Should return Bad Request for id not valid', async () => {
    return request(app)
      .get("http://localhost:10000/api/scanresult/5ac54546456")
      .expect(409)
      .then(response => assert.equal(response.body.message, "Invalid ScanResult ID."))
  })
})

describe('ScanResult Count suite', function () {
  this.timeout(0)
  it('Should assert number of ScanResult created is 2', () => {
    return request(app)
      .get("http://localhost:10000/api/scanresults")
      .expect(200)
      .then(response => {
        assert.equal(response.body.count, 2)
        assert.equal(response.body.message, "Resource found.")
      })
  })
})

describe('ScanResult update suite', function () {
  this.timeout(0)
  it('Should update a ScanResult', function () {
    return request(app)
      .put("http://localhost:10000/api/scanresult/5dcfa1944ce7c978698e1c49/update")
      .send({
        status: "Failure"
      })
      .expect(200)
      .then(response => assert.equal(response.body.message, "ScanResult updated"))
  })

  it('Should return Bad Request for ScanResult request body not passed', function () {
    return request(app)
      .put("http://localhost:10000/api/scanresult/5dcfa1944ce7c978698e1c49/update")
      .expect(400)
      .then(response => assert.equal(response.body.message, "Bad request. No data to update or ScanResult ID passed."))
  })
})


describe('ScanResult delete suite', function () {
  this.timeout(0)
  it('Should delete a ScanResult', function () {
    return request(app)
      .delete("http://localhost:10000/api/scanresult/5dcfa1944ce7c978698e1c49/delete")
      .expect(200)
      .then(response => assert.equal(response.body.message, "Resource removed"))
  })

  it('Should return Internal Server Error for ScanResult ID not passed or not valid', function () {
    return request(app)
      .delete("http://localhost:10000/api/scanresult/ /delete")
      .expect(500)
      .then(response => assert.equal(response.body.message, "Internal Server Error"))
  })
})

describe('ScanResult Findings number', function () {
  this.timeout(0)
  it('Should assert that Test Repo 2 has one finding', function () {
    return request(app)
      .get("http://localhost:10000/api/scanresult/5dcfa1944ce7c978698e1c90/findings")
      .expect(200)
      .then(response => {
        assert.equal(response.body.message, "Resource found")
        assert.equal(response.body.data, 1)
      })
  })
})