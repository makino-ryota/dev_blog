import Link from "next/link"
import React from 'react'

const Navbar = () => {
    return (
        <nav >
            <Link href="/">ホーム</Link>
            <Link href="/index-tech">Tech-未実装-</Link>
            <Link href="/index-movie">映画-未実装-</Link>
            <Link href="/index-traveling">旅行-未実装-</Link>
        </nav>
    )
}

export default Navbar