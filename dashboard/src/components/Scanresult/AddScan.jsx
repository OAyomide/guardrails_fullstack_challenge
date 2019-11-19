import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Col, Container, Row, Alert, Input, Button, Form, Label, FormGroup } from 'reactstrap'
import axios from 'axios'

import '../../styles/AddScan.css'


class AddScanComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
      validStatus: ['Queued', 'In Progress', 'Success', 'Failure'],
      status: 'Queued',
      repositoryName: '',
      alertOpen: false,
      alertMessage: '',
      buttonType: 'danger',
      isSuccessful: true
    }
  }

  // createDummyFindings creates a dummy "findings" for a ScanResult if the ScanResult has a status of "Success"
  createDummyFindings = (status, range) => {

    if (status) {
      let dummySrc = ['/bin/parser.c', '/src/pkg/atoi.go', '/dev/index.ts', '/work/algolia/grep.sh']
      let dummyType = ['ast', 'parser', 'codegen', 'lexer']
      let dummySeverity = ['HIGH', 'MEDIUM', 'LOW', 'VERY LOW']
      let randomNum = Math.ceil((Math.random() * 2) + 1) || 1
      let dummyPhraseKeyWords = ['Algorithm', 'Run', 'Parser', 'Server', 'Client', 'Boy', 'Girl', 'Person', 'Robot', 'Space', 'Genghis', 'Africa']
      let dummyPhrases = dummyPhraseKeyWords.splice(Math.floor(Math.random() * dummyPhraseKeyWords.length) - 1).join(' ')
      let dummyRuleID = (l) => {
        let randomTypeID = ''
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charsLength = chars.length
        for (let i = 0; i < l; i++) {
          randomTypeID += chars.charAt(Math.floor(Math.random() * charsLength))
        }
        return randomTypeID.toUpperCase()
      }

      let findings = []

      for (let i = 0; i < range; i++) {
        findings.push({
          type: dummyType[randomNum],
          ruleId: dummyRuleID(5),
          location: {
            path: dummySrc[randomNum],
            positions: {
              begin: {
                line: randomNum * Math.floor(Math.random() * 100)
              }
            }
          },
          metadata: {
            description: `${dummyPhrases}.`,
            severity: dummySeverity[randomNum]
          }
        })
      }
      return findings
    }
    return []
  }
  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  toggleAlert = () => {
    this.setState({ alertOpen: false })
  }

  handleStatusValueChange = (e) => {
    let value = e.target.value
    this.setState({ status: value })
  }

  handleRepositoryNameChange = (e) => {
    let repoName = e.target.value
    this.setState({ repositoryName: repoName })
  }

  async handleFormSubmit(e) {
    e.preventDefault()
    try {
      const { status, repositoryName } = this.state
      let alertOpen = status === '' || repositoryName === ''

      if (alertOpen) {
        this.setState({ alertOpen, alertMessage: 'Repository Name or Status cannot be empty.', buttonType: 'danger' })
        return
      }

      let done = ['Success', 'Failure'].includes(status)

      let finishedAt = done
      let scanningAt = status === 'In Progress'
      let queuedAt = status === 'Queued'

      let statusRandom = status === 'Success' ? 'Success' : (status === 'Failure' ? 'Failure' : null)
      let range = status === 'Success' ? Math.ceil(Math.random() * 4) || 1 : (status === 'Failure' ? Math.ceil(Math.random() * 3) || 1 : null)
      this.setState({ isSuccessful: false })
      const { data: { data } } = await axios('http://localhost:10000/api/scanresult/new', {
        headers: {
          'Content-Type': 'application/json',

        },
        method: 'POST',
        data: {
          status,
          repositoryName,
          findings: this.createDummyFindings(statusRandom, range),
          queuedAt: queuedAt ? new Date() : null,
          finishedAt: finishedAt ? new Date() : null,
          scanningAt: scanningAt ? new Date() : null
        }
      })

      const { _id: sid } = data
      this.setState({ isSuccessful: true, alertMessage: 'New ScanResult Created!', buttonType: 'success', alertOpen: true })
      this.props.history.push(`/admin/scanresult/single/?id=${sid}`)
    } catch (e) {
      if (e && e.response) {
        if (e.response.status === 404) {
          this.setState({ alertOpen: true, buttonType: 'danger', alertMessage: 'Resource not found or does not exist.' })
          return
        } else if (e.response.status === 500) {
          this.setState({ alertOpen: true, buttonType: 'danger', alertMessage: 'An Error occured in the server.' })
          return
        }
      }
    }
  }

  render() {
    return (
      <div>
        <Alert color={this.state.buttonType} isOpen={this.state.alertOpen} toggle={e => this.toggleAlert()}>{this.state.alertMessage}</Alert>
        <Container>
          <Col >
            <Card>
              <CardHeader>
                <span>Create a new ScanResult</span>
              </CardHeader>

              <CardBody>
                <Form className="form-styling" noValidate={false}>
                  <Row>
                    <FormGroup>
                      <Label for="repositoryname">Whats the Repository Name?</Label>
                      <Input placeholder="Repository Name" name="repositoryname" required onChange={e => this.handleRepositoryNameChange(e)} />
                    </FormGroup>
                  </Row>

                  <Row>
                    <FormGroup>
                      <Label for="select">Status</Label>
                      <Input type="select" name="select" id="statusselect" required onChange={e => this.handleStatusValueChange(e)} defaultValue="Queued">
                        <option value="Queued" onClick={e => console.log(`changed`)}>Queued</option>
                        <option value="In Progress" onClick={e => this.handleStatusValueChange(e)}>In Progress</option>
                        <option value="Success" onClick={e => this.handleStatusValueChange(e)}>Success</option>
                        <option value="Failure" onClick={e => this.handleStatusValueChange(e)}>Failure</option>
                      </Input>
                    </FormGroup>
                  </Row>
                  <Button color="primary" block onClick={async e => await this.handleFormSubmit(e)} disabled={!this.state.isSuccessful}>Submit</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    )
  }
}

export default AddScanComponent