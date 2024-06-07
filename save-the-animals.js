import fs from "fs"
import { utilService } from "./services/util.service.js"
import { imgService } from "./services/img.service.js"
import { pdfService } from "./services/pdf.service.js"

const OUTPUT_DIR = './output'

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
}

utilService.loadCSV('./data/rare-animals.csv')
    .then(animals => {
        const animalsWithImgUrlsPrms = animals.map(animal => {
            return imgService.suggestImg(animal.name)
                .then(imgUrl => ({ ...animal, imgUrl }))
        })
        return Promise.all(animalsWithImgUrlsPrms)
    })
    .then(animalsWithImgUrls => {
        const animalsWithImgsPrms = animalsWithImgUrls.map(animal => {
            const imgLocalPath = `${OUTPUT_DIR}/${animal.name.replace(' ', '-').toLowerCase()}.jpg`
            return utilService.download(animal.imgUrl, imgLocalPath)
                .then(() => ({ ...animal, imgLocalPath }))
        })
        return Promise.all(animalsWithImgsPrms)
    })
    .then(animalsWithImgs => {
        pdfService.buildAnimalsPDF(animalsWithImgs)
    })