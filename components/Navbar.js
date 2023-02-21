import Link from "next/link"
import React, { useEffect, useState } from 'react'



const Navbar = () => {
    // メディアクエリ
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 768) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    // メモ　
    return (
        <nav className={isMobile ? 'mobile' : 'desktop'}>
            <Link href="/">DEV</Link>
            <Link href="/index-web3">備忘録</Link>
            {/* <Link href="/index-web3">Web3</Link> */}
            <Link href="/index-hobby">LIFE</Link>
            {/* <Link href="/index-life">LIFE</Link> */}
        </nav>
    )
}

export default Navbar