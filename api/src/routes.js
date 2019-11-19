const { Router } = require('express')
const { CreateScanResult, FindScanResult, CountAllScanResults, UpdateScanResult, DeleteScanResult, FindScanResultFindingsNumber } = require('./controllers/ScanResults')
const router = Router()

router.get("/api", async (req, res) => {
    return res.status(200).json({ data: "sup bitches!" })
})

router.post("/api/scanresult/new", CreateScanResult)
router.get("/api/scanresult/:id", FindScanResult)
router.get("/api/scanresults", CountAllScanResults)
router.put("/api/scanresult/:id/update", UpdateScanResult)
router.delete("/api/scanresult/:id/delete", DeleteScanResult)
router.get("/api/scanresult/:id/findings", FindScanResultFindingsNumber)

module.exports = { router }