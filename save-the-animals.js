import fs from "fs"
import { utilService } from "./services/util.service.js"
import { imgService } from "./services/img.service.js"
import { pdfService } from "./services/pdf.service.js"

const OUTPUT_DIR = './output'
const IMAGES_PER_ANIMAL = 8

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
}

utilService.loadCSV('./data/rare-animals.csv')
    .then(animals => {
        const animalsWithImgUrlsPrms = animals.map(_createImgsUrls)
        return Promise.all(animalsWithImgUrlsPrms)
    })
    .then(animalsWithImgUrls => {
        const animalsWithImgsPrms = animalsWithImgUrls.map(_downloadAnimalImgs)
        return Promise.all(animalsWithImgsPrms)
    })
    .then(animalsWithImgs => {
        pdfService.buildAnimalsPDF(animalsWithImgs, 'SaveTheAnimals.pdf', { imgsPerRow: 3 })
    })

function _createImgsUrls(animal) {
    return imgService.suggestImgs(animal.name, IMAGES_PER_ANIMAL)
        .then(imgsUrls => {
            const imgs = imgsUrls.map(url => ({
                url,
                localPath: ''
            }))
            return { ...animal, imgs }
        })
}

function _downloadAnimalImgs(animal) {
    const imgsUrlsPrms = animal.imgs.map((img, index) => {
        const imgLocalPath = `${OUTPUT_DIR}/${animal.name.replace(' ', '-').toLowerCase()}${index}.jpg`
        return utilService.download(img.url, imgLocalPath)
            .then(() => animal.imgs[index].localPath = imgLocalPath)
    })
    return Promise.all(imgsUrlsPrms).then(() => animal)
}