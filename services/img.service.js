import { load } from "cheerio"
import { utilService } from "./util.service.js"

export const imgService = {
    suggestImg
}

function suggestImg(term) {
    const url = `https://www.istockphoto.com/search/2/image?phrase=${term}`
    return utilService.httpGet(url).then(res => {
        const $ = load(res)
        const topImg = Array.from($('[class*="yGh0CfFS4AMLWjEE9W7v"]'))[0]
        const imgUrl = topImg.attribs.src
        return imgUrl
    })
}