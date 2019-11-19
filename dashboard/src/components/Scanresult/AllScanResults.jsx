import React, { Component } from 'react'
import { Card, Row, Col, Container, CardHeader, Label, CardBody, Spinner, Pagination, PaginationItem, PaginationLink, CardFooter, Badge } from 'reactstrap'
import axios from 'axios'


// TODO: Prevent zero-index pagination; dont show neighbors if there are no ScanResults

const resultPerPage = 5

class AllScanResultsComponent extends Component {
  constructor(props) {
    let startPage = 1
    let endPage = startPage + resultPerPage - 1
    let pages = [...Array((endPage) - startPage).keys()].map(i => i)
    super(props)
    this.state = {
      allScanResults: [],
      loading: true,
      requestErrorMessage: '',
      allScanResultsLength: 0,
      paginationCount: 0,
      currentPage: 0,
      startPage: startPage,
      endPage: endPage,
      pages: pages
    }
  }

  handleViewSingleResult = e => {
    e.preventDefault()
    let sid = e.currentTarget.dataset.sid
    this.props.history.push(`/admin/scanresult/single/?id=${sid}`)
  }
  handlePaginationClick(event, currentPageDecrement) {
    this.setState({ currentPage: currentPageDecrement })
  }

  handlePaginationLinkClick(event, currentPageIncrement) {
    let startPage = currentPageIncrement * resultPerPage
    let endPage = (currentPageIncrement + 1) * resultPerPage - 1

    // offset (neighbors) of the pages left. for example, if the current page is 5, the neighbors would be 1,2,3,4 and 6, 7, 8, 9...
    let pages = [...Array((endPage) - startPage).keys()].map(a => a)
    this.setState({ currentPage: currentPageIncrement, startPage: startPage, endPage: endPage, pages: pages })
  }


  async componentDidMount() {
    try {
      const { data: { data: requestData, count } } = await axios.get('http://localhost:10000/api/scanresults')

      const paginationCount = Math.ceil(count / resultPerPage)
      this.setState({ allScanResults: requestData, loading: false, paginationCount: paginationCount, endPage: count })
    } catch (e) {
      if (e && e.response) {
        if (e.response.status === 404) {
          this.setState({ requestErrorMessage: 'Resource not found.', loading: false })
          return
        } else if (e.response.status === 500) {
          this.setState({ requestErrorMessage: 'Internal Server Error', loading: false })
        }
      }
    }
  }
  render() {
    const { allScanResults, loading, requestErrorMessage, currentPage } = this.state
    return (
      <div>
        <Container>
          <Col>
            <Card>
              <CardHeader>
                <Label> All ScanResults</Label>
              </CardHeader>

              <CardBody>
                <Col>
                  {loading && !requestErrorMessage ? <Spinner></Spinner> : (loading && requestErrorMessage ? <Label>{requestErrorMessage}</Label>
                    : (allScanResults.length === 0 ? <Label>No ScanResult</Label>
                      : allScanResults.slice(currentPage * resultPerPage, (currentPage + 1) * resultPerPage).map((x, y) => {
                        const { status, repositoryName, _id, findings } = x
                        let timestampAt = status === 'Failure' || status === 'Success' ? 'finishedAt' : (status === 'In Progress' ? 'scanningAt' : 'queuedAt')
                        return (
                          <div key={y} onClick={e => this.handleViewSingleResult(e)} data-sid={_id}>
                            <Row key={y}>
                              <Card key={y} style={{ width: '400px' }}>
                                <CardBody key={y + 1}>
                                  <div key={y + 2}>
                                    <Label>Name: {repositoryName}</Label>
                                    {findings.length === 0 ? '' : <Badge style={{ marginLeft: '20px' }}>{findings.length}</Badge>}
                                    <br />
                                    <Label>Status: {status}</Label>
                                    <br />
                                    <Label>{`${timestampAt}: ${x[timestampAt] || null}`}</Label>
                                  </div>
                                </CardBody>
                              </Card>
                            </Row>
                            <br />
                          </div>
                        )
                      })))}
                </Col>
              </CardBody>
              <CardFooter>
                <Pagination>
                  <PaginationItem disabled={this.state.currentPage <= 0}>
                    <PaginationLink previous href="#" onClick={e => this.handlePaginationClick(e, this.state.currentPage - 1)}>

                    </PaginationLink>
                  </PaginationItem>

                  {this.state.pages.map(i => {
                    return (
                      <PaginationItem active={i === this.state.currentPage} key={i}>
                        <PaginationLink onClick={e => this.handlePaginationLinkClick(e, i)} href="#">
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem disabled={this.state.currentPage >= this.state.paginationCount - 2}>
                    <PaginationLink next href="#" onClick={e => this.handlePaginationClick(e, this.state.currentPage + 1)}>

                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardFooter>
            </Card>
          </Col>
        </Container>
      </div>
    )
  }
}

export default AllScanResultsComponent