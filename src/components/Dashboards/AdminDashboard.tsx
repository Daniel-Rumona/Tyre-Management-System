'use client'

import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const AdminDashboard = () => {
  const tyreLifespanChart = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Average Tyre Lifespan by Brand'
    },
    xAxis: {
      categories: ['Bridgestone', 'Michelin', 'Apollo', 'Other']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Lifespan (Hours)'
      }
    },
    series: [
      {
        name: 'Lifespan',
        data: [1200, 1400, 1000, 900]
      }
    ]
  }

  const failureReasonsChart = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Tyre Failure Reasons'
    },
    series: [
      {
        name: 'Failures',
        colorByPoint: true,
        data: [
          { name: 'Crown Damaged', y: 405 },
          { name: 'Worn Out', y: 363 },
          { name: 'Sidewall Damaged', y: 211 },
          { name: 'Tread Penetration', y: 200 },
          { name: 'Bead Damaged', y: 189 },
          { name: 'Rim Damaged', y: 102 }
        ]
      }
    ]
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Total Tyres' value={320} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Machines Tracked' value={18} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Inspections This Month' value={87} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title='Scrap Rate (%)' value={16.5} precision={1} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className='mt-6'>
        <Col xs={24} md={12}>
          <Card>
            <HighchartsReact
              highcharts={Highcharts}
              options={tyreLifespanChart}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <HighchartsReact
              highcharts={Highcharts}
              options={failureReasonsChart}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminDashboard
