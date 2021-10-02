import * as React from 'react'
import Link from 'next/link'
import NextNprogress from 'nextjs-progressbar';

import '../components/tailwind.scss'
import '../components/app.scss'
import '../components/loading.scss'

export const App: React.FC<{
    Component: React.FC, pageProps: any
}> = ({ Component, pageProps }) => {
    return (
        <>
            <NextNprogress
                color="#29D"
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={true}
            />
            <div className="container md:w-1/3 py-32" >
                <Link href="/">
                    <div className="text-center my-3 text-lg cursor-pointer">
                        spotify2image
                    </div>
                </Link>
                <div className="text-center my-3 text-md">
                    <a href="https://github.com/iamtakagi/spotify2image" className="border-b hover:border-purple-800 text-purple-800 border-transparent">See this repository</a>
                </div>
                <Component {...pageProps} />
            </div>
        </>
    )
}

export default App