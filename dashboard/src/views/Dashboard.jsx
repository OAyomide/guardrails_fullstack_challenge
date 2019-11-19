import React, { Component } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import AddScanResult from '../components/Scanresult/AddScan'
import AllScanResults from '../components/Scanresult/AllScanResults'
import SingleScanResult from '../components/Scanresult/SingleScanResult'
import NotFound from '../components/NotFound'
import '../styles/Dashboard.css'


class DashboardView extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <div className="dashboard-main">
            <Switch>
              <Route component={AddScanResult} exact path="/" redirect={() => (<Redirect to="/admin/scanresult/add" />)} />
              < Route component={AddScanResult} exact path="/admin/scanresult/add" />
              <Route component={AllScanResults} exact path="/admin/scanresults" />
              <Route component={SingleScanResult} exact path="/admin/scanresult/single" />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Sidebar />
        </div>
      </Router>
    )
  }
}

export default DashboardView