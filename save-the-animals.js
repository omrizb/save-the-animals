import fs from "fs"
import { utilService } from "./services/util.service.js"
import { imgService } from "./services/img.service.js"
import { pdfService } from "./services/pdf.service.js"

const DATA_CSV = './data/rare-animals.csv'
const OUTPUT_DIR = './output'
const IMAGES_PER_ANIMAL = 5
const PDF_FILE_NAME = 'SaveTheAnimals.pdf'
const PDF_IMAGES_PER_ROW = 2

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR)
}

utilService.loadCSV(DATA_CSV)
    .then(animals => {
        const animalsWithImgUrlsPrms = animals.map(_createImgsUrls)
        return Promise.all(animalsWithImgUrlsPrms)
    })
    .then(animalsWithImgUrls => {
        const animalsWithImgsPrms = animalsWithImgUrls.map(_downloadAnimalImgs)
        return Promise.all(animalsWithImgsPrms)
    })
    .then(animalsWithImgs => {
        pdfService.buildAnimalsPDF(animalsWithImgs, PDF_FILE_NAME, { imgsPerRow: PDF_IMAGES_PER_ROW })
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