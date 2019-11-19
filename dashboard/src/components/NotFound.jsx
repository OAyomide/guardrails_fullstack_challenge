import React, { Component } from 'react'
import { Container, Card, CardBody, Label } from 'reactstrap'

class NotFoundComponent extends Component {
  render() {
    return (
      <div>
        <Container>
          <Card>
            <CardBody>
              <Label>Page Not Found. Please try again</Label>
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default NotFoundComponent