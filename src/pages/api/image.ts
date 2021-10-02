import { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda"
import fs from 'fs'
import path from 'path'
import { SPOTIFY_IMAGE_HEIGHT, SPOTIFY_IMAGE_WIDTH } from "../../consts";

const chromiumFontSetup = () => {
    if (process.env.HOME == null) process.env.HOME = "/tmp"
    const dest = process.env.HOME + "/.fonts"
    if (!fs.existsSync(dest)) fs.mkdirSync(dest)
    const src = __dirname + "../fonts/mplus"
    for (const font of fs.readdirSync(src)) {
        if (!font.endsWith(".ttf")) continue
        if (fs.existsSync(path.join(dest, font))) continue
        fs.copyFileSync(path.join(src, font), path.join(dest, font))
    }
}

const shot = async (embedUrl: string) => {
    chromiumFontSetup()
    const { puppeteer } = chromium
    const agent = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: {
            deviceScaleFactor: 2,
            width: SPOTIFY_IMAGE_WIDTH,
            height: SPOTIFY_IMAGE_HEIGHT,
        },
        executablePath: await chromium.executablePath,
        env: {
            ...process.env,
            LANG: "ja_JP.UTF-8"
        }
    })
    const page = await agent.newPage()
    try {
        await page.goto(embedUrl)
        return await page.screenshot({type: "png"})
    } finally {
        await page.close()
    }
}

const image = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("X-Robots-Tag", "noindex")
    const type = req.query["type"]
    const id = req.query["id"]

    if (typeof type !== "string") return res.status(400).write("invalid type")
    if (typeof id !== "string") return res.status(400).write("invalid id")

    const embedUrl = `https://open.spotify.com/embed/${type}/${id}`
    
    res.setHeader("Link", `<${embedUrl}>; rel="canonical"`)
    const img = await shot(embedUrl)
    res.setHeader("Content-Type", "image/png")
    res.setHeader("Cache-Control", "max-age=86400, public, stale-while-revalidate")
    res.setHeader("Content-DPR", "2.0")
    res.send(img)
}

export default image