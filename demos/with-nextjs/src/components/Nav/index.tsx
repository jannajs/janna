/* eslint-disable next/no-html-link-for-pages */
import Link from 'next/link'
import React from 'react'

export interface NavProps {
}

const Nav: React.FC<NavProps> = () => {
  return (
    <div className='flex flex-col text-blue-500'>
      <a href='/' className='hover:underline'>[App] Home without link</a>
      <Link href='/' className='hover:underline'>[App] Home</Link>
      <a href='/hello3' className='hover:underline'>[App] Hello3 without link</a>
      <Link href='/hello3' className='hover:underline'>[App] Hello3</Link>
      <Link href='/hello' className='hover:underline'>[Pages] Hello</Link>
      <Link href='/hello2' className='hover:underline'>[Pages] Hello2</Link>
    </div>
  )
}

export default Nav
