import Head from 'next/head'
import { useState } from 'react'
import { DateTime } from 'luxon';
import sortBy from 'lodash.sortby';

function LoadingState () {
    return (
        <p>Loading</p>
    )
}

function SupperReport(props) {
    const total = props.transactions.reduce((memo, transaction) => memo + transaction.quantity, 0)

    const orderedTransactions = sortBy(props.transactions, 'customer_email');

    return (
        <div className="mb-5" >
            <table className="table table-striped">
                <thead className="thead-dark"> 
                    <tr>
                        <th scope="col">Email</th>
                        <th scope="col">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderedTransactions.map(transaction => {
                            return (<tr key={transaction.sessionId}>
                                <td>
                                    {transaction.customer_email}
                                </td>
                                <td>
                                    {transaction.quantity}
                                </td>
                            </tr>);
                        })
                    }
                </tbody>
                <thead className="thead-dark"> 
                    <tr>
                        <th scope="row">Total</th>
                        <td>{total}</td>
                    </tr>
                </thead>
            </table>
        </div>
    )
}

function ResultState (props) {

    const [selectedDate, setSelectedDate] = useState(null);

    if (!props.drillSupperData) {
        return null;
    }

    const suppers = Object.keys(props.drillSupperData);

    return (
        <div>
            <h1 className="d-none d-print-block">Drill Supper Report</h1>
            <p className="d-none d-print-block">Generated At: {DateTime.local().toISO()}</p>
            <h2>
                <select className="form-select" aria-label="Default select example" defaultValue="null" onChange={event => setSelectedDate(event.target.value)}>
                    <option value="null" disabled>Select Drill Supper</option>
                    {
                        suppers.map(supper => {
                            const supperDate = DateTime.fromISO(supper);
                            return <option key={supper} value={supper} >
                                {DateTime.fromISO(supper).toFormat('ccc dd LLL, h.mma', { locale: "en-GB" })}
                            </option>
                        })
                    }
                </select>
            </h2>
            {selectedDate ? <SupperReport transactions={props.drillSupperData[selectedDate]}/> : null}
        </div>
    )
}

export default function Home() {

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [drillSupperData, setDrillSupperData] = useState(null);

  async function getDrillSupperData() {
    setLoading(true);

    try {
      const body = {
        password
      }

      const response = await fetch("/api/purchase_report", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      });

      const data = await response.json();

      setDrillSupperData(data)
    } finally {
      setLoading(false);
    }
  }
    

  return (
    <>
      <Head>
        <title>Drill Supper Report</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container-fluid" style={{ maxWidth: 600, marginTop: '2em' }}>
        
        <form onSubmit={(event) => {
            event.preventDefault();
            getDrillSupperData();
        }}>
            <div className="row">
                <div className="col text-center d-print-none">
                    <h1>Drill Supper Report</h1>
                    <div className="row mt-4">
                        <div className="col">
                                <label className="mr-2" htmlFor="password">Password: &nbsp;&nbsp;&nbsp;</label>
                                <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} />
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <button className="btn btn-primary" type="submit" value="Generate">
                                { 
                                    loading ? <div className="spinner-border" role="status"></div> : <span>Request Data</span>
                                }  
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <hr className="mt-4 mb-4"/>

        {
            loading ? null : <ResultState drillSupperData={drillSupperData} />
        }
      </div>
    </>
  )
}
