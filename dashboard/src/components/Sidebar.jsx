import React, { Component } from 'react'
import '../styles/Sidebar.css'



class SidebarComponent extends Component {
  render() {
    return (
      <div className="sidebar-nav">
        <a href="/admin/scanresults">All ScanResults</a>
        <br />
        <a href="/admin/scanresult/add">Add ScanResults</a>
      </div>
    )
  }
}

export default SidebarComponent
