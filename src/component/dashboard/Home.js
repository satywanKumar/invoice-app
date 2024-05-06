import Chart from 'chart.js/auto';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'

const Home = () => {
  const [total, setTotal] = useState(0)
  const [totalInvoice, setTotalInvoice] = useState(2456)
  const [totalMonthCollection, setTotalMonthCollection] = useState(4562)
  const [invoices, setInvoices] = useState([])
  useEffect(() => {
    getData()
    // createChart()
  }, [])

  const getData = async () => {
    const q = query(collection(db, "invoices"), where('uid', "==", localStorage.getItem('uid')))
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    // console.log(data)
    setInvoices(data)
    // console.log('home',data)
    getOverAllTotal(data)
    getMonthsTotal(data)
    monthWiseCollection(data)
  }

  const getOverAllTotal = (invoiceList) => {
    var t = 0;
    invoiceList.forEach(data => {
      // console.log(data)
      t += data.total
    })
    setTotal(t)
  }

  const getMonthsTotal = (invoiceList) => {
    var mt = 0;
    invoiceList.forEach(data => {
      if (new Date(data.date.seconds * 1000).getMonth() == new Date().getMonth()) {
        console.log(data)
        mt += data.total
      }
    })
    setTotalMonthCollection(mt)

  }

  const monthWiseCollection = (data) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }

    data.forEach(d => {
      // console.log('data',new Date(d.date.seconds * 1000).getFullYear())
      if (new Date(d.date.seconds * 1000).getFullYear() == new Date().getFullYear()) {
        console.log('current year data', d)
        // console.log(new Date(d.date.seconds * 1000).toLocaleDateString('default',{month:'long'}))
        chartData[new Date(d.date.seconds * 1000).toLocaleDateString('default', { month: 'long' })] += d.total
      }
    })
    console.log(chartData)
    createChart(chartData);

  }

  const createChart = (chartData) => {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Month wise Collection',
          data: Object.values(chartData),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  return (
    <div>
      <div className='home-first-row'>
        <div className='home-box box-1'>
          <h1 className='box-header'>Rs {total}</h1>
          <p className='box-title'>Overall </p>
        </div>

        <div className='home-box box-2'>
          <h1 className='box-header'>{invoices.length}</h1>
          <p className='box-title'>Invoices</p>
        </div>

        <div className='home-box box-3'>
          <h1 className='box-header'>Rs {totalMonthCollection}</h1>
          <p className='box-title'>This Month</p>
        </div>

      </div>

      <div className='home-second-row'>

        <div className='chart-box'>
          <canvas id="myChart"></canvas>
        </div>

        <div className='recent-invoice-list'>
          <h1>Recent Invoice List</h1>
          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>
          {
            invoices.slice(0, 6).map(data => (
              <div>
                <p>{data.to}</p>
                <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
                <p>{data.total}</p>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  )
}

export default Home
