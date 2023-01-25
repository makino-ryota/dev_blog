import Link from "next/link"
import React from 'react'

const Navbar = () => {
    return (
        <nav >
            <Link href="/">HOME（DEV）</Link>
            <Link href="/index-web3">Web3</Link>
            <Link href="/index-hobby">MOVIE/BOOK</Link>
            <Link href="/index-life">LIFE</Link>
        </nav>
    )
}

export default Navbar