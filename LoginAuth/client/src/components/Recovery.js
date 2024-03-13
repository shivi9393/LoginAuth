import React from 'react'
import {Link} from 'react-router-dom'

import styles from '../styles/Username.module.css';
import {Toaster} from 'react-hot-toast';



export default function Recovery() {



  return (
    <div className="container mx-auto">

    <Toaster position='top-centre' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Account Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Enter OTP to recover password</span>
          </div>

          <form className='pt-20' >
            

            <div className=' textbox flex flex-col items-center gap-6'>
              <div className='input text-center'>
              <span className=' py-4 text-sm text-left text-gray-500'>Enter a 6 digit OTP sent to your email address</span>
              <input  className={styles.textbox} type='text' placeholder='Enter OTP'/>
              </div>
              
              <button className={styles.btn} type='sumbit'>Sign In</button>
            </div>

            <div className=' text-center py-4'>
              <span className='text-gray-500'>Didn't recived OTP? <button className='text-red-500' > Resend OTP</button></span>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
