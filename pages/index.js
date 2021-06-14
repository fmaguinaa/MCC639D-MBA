import Head from 'next/head'
import 'antd/dist/antd.css'

import Model from './components/Model'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Model name="gg"/>
      </main>
    </div>
  )
}
