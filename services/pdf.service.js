import fs from "fs"
import PDFDocument from "pdfkit"

export const pdfService = {
    buildAnimalsPDF
}

function buildAnimalsPDF(animals, fileName = 'SaveTheAnimals.pdf') {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(fileName))
    doc
        .fontSize(60)
        .text('Save The Animals', 100, 100)

    animals.forEach(animal => _addAnimalPage(doc, animal))

    doc.end()
}

function _addAnimalPage(doc, animal) {
    doc.addPage()
    doc.fontSize(36)
    doc.text(animal.name)
    doc.fontSize(20)
    doc.text(`How many left: ${animal.count}`)
    doc.image(animal.imgLocalPath, { width: 480 })
}