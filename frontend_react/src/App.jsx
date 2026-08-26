import { useState, useEffect } from 'react'

function App(){
  const [dataDjango, setDataDjango]=useState(null)
  const [dataNode, setDataNode]=useState(null)
  const [pgData, setPgData]=useState(null)
  const [mysqlData, setMysqlData]=useState(null)
  
  const djangoUrl_test=import.meta.env.VITE_API_DJANGO_TEST_URL
  const nodeUrl_test=import.meta.env.VITE_API_NODE_TEST_URL
  const djangoUrl_db=import.meta.env.VITE_API_DJANGO_DB_URL
  const nodeUrl_db=import.meta.env.VITE_API_NODE_DB_URL  

  useEffect(()=>{
    fetch(`${djangoUrl_test}`)
      .then(res=>res.json())
      .then(d=>setDataDjango(d))
      .catch(err=>console.error("django error:", err))

    fetch(`${djangoUrl_db}`)
      .then(res=>res.json())
      .then(d=>setPgData(d))
      .catch(err=>console.error("pgdata error:", err))

    fetch(`${nodeUrl_test}`)
      .then(res=>res.json())
      .then(d=>setDataNode(d))
      .catch(err=>console.error("node error:", err))

    fetch(`${nodeUrl_db}`)
      .then(res=>res.json())
      .then(d=>setMysqlData(d))
      .catch(err=>console.error("mysqldata error:", err))
  },[])

  return (
    <div style={{padding:'20px', fontFamily:'sans-serif', lineHeight:'1.8'}}>
      <h1>React_Django_Psql_NODE_Mysql_Test</h1>
      <h2>backend_django</h2>      
      <p>API return info: {dataDjango?dataDjango.message:"loading..."}</p>
      <p>return env param from backend: {dataDjango?dataDjango.secret_from_env:"..."}</p>
      <hr />
      <h2>backend_node</h2>      
      <p>API return info: {dataNode?dataNode.message:"loading..."}</p>
      <p>return env param from backend: {dataNode?dataNode.secret_from_env:"..."}</p>
      <p>time stamp: {dataNode?dataNode.timestamp:"..."}</p>

      <div style={{display:'flex', gap:'40px'}}>
        <div style={{color:pgData?.source==='Redis_cache'?'green':'orange', flex:1, border:'1px solid #ccc', padding:'15px', borderRadius:'8px'}}>
          <h2>postgresql (via django)</h2>
          data_source: {pgData?pgData.source:'...'}
          {pgData?(
            <ul>
              {pgData.items.map((item,idx)=>(
                <li key={idx}><strong>{item.name}</strong>:{item.description}</li>
              ))}
            </ul>
          ):<p>loading...</p>}
        </div>
        <div style={{color:mysqlData?.source==='Redis_cache'?'green':'orange',flex:1, border:'1px solid #ccc', padding:'15px', borderRadius:'8px'}}>
          <h2>mysql (via node)</h2>
          data_source: {mysqlData?mysqlData.source:'...'}
          {mysqlData? (
            <ul>
              {mysqlData.items.map((item, idx)=>(
                <li key={idx}><strong>{item.name}</strong>:{item.description}</li>
              ))}
            </ul>
          ):<p>loading...</p>}
        </div>
      </div>
    </div>
  )
}

export default App