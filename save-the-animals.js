import fs from 'fs'
import { utilService } from "./services/util.service.js"
import { imgService } from "./services/img.service.js"

const OUTPUT_DIR = './output'

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
}

utilService.loadCSV('./data/rare-animals.csv')
    .then(animals => {
        const animalsWithImgUrlsPrms = animals.map(animal => {
            return imgService.suggestImg(animal.name)
                .then(img => ({ ...animal, img }))
        })
        return Promise.all(animalsWithImgUrlsPrms)
    })
    .then(animalsWithImgUrls => {
        console.log(animalsWithImgUrls)
        const animalsWithImgsPrms = animalsWithImgUrls.map(animal => {
            utilService.download(animal.img, `${OUTPUT_DIR}/${animal.name}.jpg`)
        })
        return Promise.all(animalsWithImgsPrms)
            .then(() => animalsWithImgUrls)
    })
    .then(animalsWithImgs => {
        console.log(animalsWithImgs)
        // TODO: Use the pdfService to build the animals PDF
    })