import React, { Component } from 'react'
import { Card, CardHeader, Label, Container, Spinner, CardBody } from 'reactstrap'
import axios from 'axios'
import qs from 'qs'

class SingleScanResultComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alertOpen: false,
      alertMessage: '',
      buttonType: '',
      repositoryName: '',
      findings: [],
      status: '',
      loading: false
    }
  }
  async componentDidMount() {
    try {
      this.setState({ loading: true })
      const { id } = qs.parse(window.location.search.substr(1))
      const { data: { data: { repositoryName, findings } } } = await axios(`http://localhost:10000/api/scanresult/${id}`)

      this.setState({ loading: false, repositoryName: repositoryName, findings: findings })
    } catch (e) {
      if (e && e.response) {
        if (e.response.status === 404) {
          this.setState({ alertOpen: true, alertMessage: 'Selected Scan Result does not exist.', buttonType: 'danger', loading: false })
        } else if (e.response.status === 500) {
          this.setState({ alertOpen: true, alertMessage: 'Internal Server Error', buttonType: 'danger' })
        }
      }
    }
  }
  render() {
    const { loading, repositoryName, findings, alertOpen, alertMessage } = this.state
    return (
      <div>
        <Container>
          <Card>
            <CardHeader>
              {loading ? <Spinner></Spinner> : (alertOpen ? <Label></Label> : <Label>{repositoryName}</Label>)}
            </CardHeader>

            <CardBody>
              {alertOpen ? <Label>{alertMessage}</Label> : (findings.length === 0 ? <Label>ScanResult has no findings.</Label> : findings.map((finding, index) => {
                return (
                  <div key={index}>
                    <Card>
                      <CardBody>
                        <Label>RuleId: {finding.ruleId}</Label>
                        < br />
                        <Label>Description: {finding.metadata.description}</Label>
                        < br />
                        <Label>Severity: {finding.metadata.severity}</Label>
                        < br />
                        <Label>Path name: {finding.location.path}</Label>
                        < br />
                        <Label>Line: {finding.location && finding.location.positions && finding.location.positions.begin && finding.location.positions.begin.line}</Label>
                      </CardBody>
                    </Card>
                  </div>
                )
              }))}
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default SingleScanResultComponent