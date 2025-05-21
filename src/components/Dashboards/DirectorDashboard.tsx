'use client'
import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Spin, Modal, Button } from 'antd'
import {
  DollarCircleOutlined,
  TagsOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import dayjs from 'dayjs'
import type { StatisticProps } from 'antd'
import CountUp from 'react-countup'

const formatter: StatisticProps['formatter'] = value => (
  <CountUp end={value as number} separator=',' />
)

export default function DirectorDashboard () {
  const [tyres, setTyres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedChart, setExpandedChart] = useState<null | 'brand' | 'status'>(
    null
  )

  useEffect(() => {
    const fetchTyres = async () => {
      const snap = await getDocs(collection(db, 'tyres'))
      const tyres = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTyres(tyres)
      setLoading(false)
    }
    fetchTyres()
  }, [])

  const totalSpend = tyres.reduce((sum, t) => sum + (t.cost || 0), 0)
  const avgCost = tyres.length ? totalSpend / tyres.length : 0
  const spendByBrand = tyres.reduce((acc, t) => {
    const brand = t.brand || 'Unknown'
    acc[brand] = (acc[brand] || 0) + (t.cost || 0)
    return acc
  }, {} as Record<string, number>)

  const statusCount = tyres.reduce((acc, t) => {
    const status = t.status || 'Unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const brandChartOptions = {
    title: { text: 'Tyre Spend by Brand' },
    xAxis: {
      categories: Object.keys(spendByBrand),
      title: { text: 'Brand' }
    },
    yAxis: {
      title: { text: 'Total Spend (ZAR)' },
      labels: {
        formatter: function () {
          const val = this.value
          if (val >= 1000000) return `ZAR ${(val / 1000000).toFixed(1)}M`
          if (val >= 1000) return `ZAR ${(val / 1000).toFixed(1)}K`
          return `ZAR ${val}`
        }
      }
    },
    tooltip: {
      pointFormat: 'Spend: <b>ZAR {point.y:,.2f}</b>'
    },
    series: [
      {
        type: 'column',
        name: 'Spend (ZAR)',
        data: Object.values(spendByBrand),
        dataLabels: {
          enabled: true,
          formatter: function () {
            const val = this.y
            if (val >= 1000000) return `R ${(val / 1000000).toFixed(1)}M`
            if (val >= 1000) return `R ${(val / 1000).toFixed(1)}K`
            return `R ${val}`
          }
        }
      }
    ]
  }

  const statusChartOptions = {
    chart: { type: 'pie' },
    title: { text: 'Tyre Status Distribution' },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} tyres)'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y} tyres '
        }
      }
    },
    series: [
      {
        name: 'Tyres',
        data: Object.entries(statusCount).map(([status, count]) => ({
          name: status,
          y: count
        }))
      }
    ]
  }

  if (loading) return <Spin size='large' />

  return (
    <div className='p-4'>
      <Row gutter={16} className='mb-4'>
        <Col span={8}>
          <Card loading={loading} bordered={false}>
            <Statistic
              title='Total Tyres'
              value={tyres.length}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading} bordered={false}>
            <Statistic
              title='Total Spend'
              value={totalSpend.toFixed(2)}
              prefix={<DollarCircleOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading} bordered={false}>
            <Statistic
              title='Average Cost per Tyre'
              value={avgCost.toFixed(2)}
              prefix={<DollarCircleOutlined />}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card
            title='Spend Distribution'
            extra={
              <Button
                icon={<BarChartOutlined />}
                onClick={() => setExpandedChart('brand')}
              >
                Expand
              </Button>
            }
            loading={loading}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={brandChartOptions}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title='Tyre Status Distribution'
            extra={
              <Button
                icon={<PieChartOutlined />}
                onClick={() => setExpandedChart('status')}
              >
                Expand
              </Button>
            }
            loading={loading}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={statusChartOptions}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        open={!!expandedChart}
        onCancel={() => setExpandedChart(null)}
        footer={null}
        width='80%'
        destroyOnClose
      >
        {expandedChart && (
          <HighchartsReact
            key={expandedChart} // forces rerender
            highcharts={Highcharts}
            options={
              expandedChart === 'brand' ? brandChartOptions : statusChartOptions
            }
          />
        )}
      </Modal>
    </div>
  )
}
