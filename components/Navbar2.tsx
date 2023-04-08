import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar(){
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const navbarStyle = {
        backgroundColor: `rgba(24, 58, 82, ${scrollPosition > 80 ? 0.5 : 1})`,
    };

    return (
        <nav style={navbarStyle} className="flex justify-center w-screen md:h-14 xs:h-28 top-0 left-0 fixed">
            <div className="flex items-center pl-8 h-14">
                <svg className="w-6 h-6 text-gray-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.172-6.828a2.828 2.828 0 114 0l.707.707a3.828 3.828 0 10-5.414 0l.707-.707zm2.828-4.586a1 1 0 11-1.414-1.414 1 1 0 011.414 1.414z" clipRule="evenodd" />
                </svg>
                <Link href="/">
                <h1 className="text-white text-xl font-bold hover:bg-gray-700">さまらいずApp</h1>
                </Link>
            </div>
            <div className="flex items-center pl-8 h-14 justify-end">
                <div className="flex space-x-4">
                <Link href="/contact-page">
                    <p className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">
                    Contact Us
                    </p>
                </Link>
                </div>
            </div>
        </nav>
    )
}