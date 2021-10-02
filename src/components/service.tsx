import { FormEvent, useEffect, useState } from "react"
import Image from 'next/image'
import { SPOTIFY_IMAGE_HEIGHT, SPOTIFY_IMAGE_WIDTH, SPOTIFY_URL_REGEX } from "../consts"

export const Service: React.FC<{}> = () => {
    const [url, setUrl] = useState<string>("")
    const [imageLoading, setImageLoading] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string | null>()

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (url) {
            if(!SPOTIFY_URL_REGEX.test(url)) return
            setImageLoading(true)
            setImageUrl(url.replace(SPOTIFY_URL_REGEX, (_: any, item: string) => `https://spotify2image.vercel.app/image/${item}#.png`))
        }
    }

    return (
        <>
            <form className="flex inline" method="PUT" onSubmit={(e) => { submit(e) }}>
                <input
                    className="form-input mt-1 block w-full border-solid border-2 rounded-md focus:border-green-500"
                    value={url}
                    required={true}
                    placeholder="https://open.spotify.com/..."
                    onChange={(event) => setUrl(event.target.value)}
                />
                <button type="submit" className="ml-2 transition duration-500 ease-in-out whitespace-nowrap block items-center justify-center border border-transparent 
                px-2 py-2 my-1 rounded-full shadow-sm text-base font-medium text-white bg-green-500 hover:bg-transparent hover:border-green-500 hover:text-green-500">Generate</button>
            </form>

            <div className="mt-10 flex flex-col space-y-1">
                {imageUrl &&
                    <div>
                        {imageLoading && <div className="loading"/>}
                        {imageUrl && <Image src={imageUrl} alt=""　width={SPOTIFY_IMAGE_WIDTH} height={SPOTIFY_IMAGE_HEIGHT} quality={100}　onLoadingComplete={() => {setImageLoading(false)}} />}
                        <div className="mt-10">
                            <SpotifyImageLinks url={url} imageUrl={imageUrl} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

const SpotifyImageLinks: React.FC<{ url: string, imageUrl: string }> = ({ url, imageUrl }) => {
    return (
        <div className="flex flex-col space-y-1">
            <p>Image URL</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={imageUrl}
            />
            <p>Scrapbox</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`[${imageUrl} ${url}]`}
            />
            <p>Markdown</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`[![spotify2image](${imageUrl})](${url})`}
            />
            <p>HTML</p>
            <textarea
                className="form-input mt-1 block w-full border-solid border-2 rounded-md resize-none"
                value={`<a href="${url}"><img src="${imageUrl}"></a>`}
            />
        </div>

    )
}