import React, { Component } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap'

class HeaderComponent extends Component {
  render() {
    return (
      <div>
        <Nav style={{ marginLeft: '203px', backgroundColor: "rgb(41, 114, 128)" }} className="text-center">
          <NavItem style={{ color: "white" }} className="mx-auto">
            <NavLink>Admin Dashboard</NavLink>
          </NavItem>
        </Nav>
      </div>
    )
  }
}

export default HeaderComponent