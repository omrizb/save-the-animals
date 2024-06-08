import { load } from "cheerio"
import { utilService } from "./util.service.js"

export const imgService = {
    suggestImgs
}

function suggestImgs(term, count = 1) {
    const url = `https://www.istockphoto.com/search/2/image?phrase=${term}`
    return utilService.httpGet(url).then(res => {
        const imgsUrls = []
        const $ = load(res)
        const rawImgs = Array.from($('[class*="yGh0CfFS4AMLWjEE9W7v"]'))
        for (let i = 0; i < count; i++) {
            imgsUrls.push(rawImgs[i].attribs.src)
        }
        return imgsUrls
    })
}