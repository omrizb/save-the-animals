import fs from "fs"
import imageSize from "image-size"
import PDFDocument from "pdfkit"

export const pdfService = {
    buildAnimalsPDF
}

function buildAnimalsPDF(animals, fileName = 'SaveTheAnimals.pdf', options = {}) {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(fileName))
    doc
        .fontSize(60)
        .text('Save The Animals', 100, 100)

    animals.forEach(animal => _addAnimalPage(doc, animal, options))

    doc.end()
}

function _addAnimalPage(doc, animal, options) {
    const imgsPerRow = options.imgsPerRow || 1

    doc.addPage()
    doc.fontSize(36)
    doc.text(animal.name)
    doc.fontSize(20)
    doc.text(`How many left: ${animal.count}`)

    const imgs = animal.imgs.map(img => img.localPath)
    _createImgsGrid(doc, imgs, imgsPerRow)
}

function _createImgsGrid(doc, imgs, imgsPerRow = 1) {
    const startX = doc.x
    const startY = doc.y
    const gapX = 20
    const gapY = 20

    const imgWidth = (doc.page.width - 2 * startX - gapX * (imgsPerRow - 1)) / imgsPerRow

    let x = startX
    let y = startY
    let rowHeight = 0

    imgs.forEach((img, index) => {
        const { width, height } = imageSize(img)

        if (index % imgsPerRow === 0 && index !== 0) {
            x = startX
            y += rowHeight + gapY
            rowHeight = 0
        }

        doc.image(img, x, y, { width: imgWidth })
        x += imgWidth + gapX
        rowHeight = Math.max(rowHeight, imgWidth / width * height)
    })
}

