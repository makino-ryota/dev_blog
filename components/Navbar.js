import Link from "next/link"
import React from 'react'

const Navbar = () => {
    return (
        <nav >
            <Link href="/">ホーム（開発）</Link>
            <Link href="/index-web3">Web3</Link>
            <Link href="/index-movie">映画・本</Link>
            <Link href="/index-life">LIFE</Link>
        </nav>
    )
}

export default Navbar