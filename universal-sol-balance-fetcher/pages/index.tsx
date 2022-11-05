import * as web3 from '@solana/web3.js'; //we'll use the web3 JS library provided to us by Solana
import Head from 'next/head';
import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import AddressForm from '../components/AddressForm'

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [isExecutable, setIsExecutable] = useState(false)

  const addressSubmittedHandler = (address: string) => {
    try {
      //The first thing we wanna do here is convert the address from string to public key
      const key = new web3.PublicKey(address) //This will validate that whatever you pass in is actually a Solana address
      setAddress(key.toBase58())

      //use the getBalance function and set the result with setBalance
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
      connection.getBalance(key).then(balance => {
        setBalance(balance / web3.LAMPORTS_PER_SOL)
      })

      //Use the method getAccountInfo to get a JSON object with information about the account
      connection.getAccountInfo(key).then(response => {
        setIsExecutable(response?.executable ?? false) // ?? false means if there's no response, it should return false
      })
    } catch(error) {
        setAddress('')
        setBalance(0)
        alert(error)
    }
  }

  return (
    <div className={styles.App}>
      <Head>
        <title>SOL balance fetcher</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className={styles.AppHeader}>
        <p>
          Check the SOL balance of any address
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>Is it executable?{isExecutable === true ? ' Yup.' : ' Nope'}</p>
      </header>
    </div>
  )
}

export default Home
