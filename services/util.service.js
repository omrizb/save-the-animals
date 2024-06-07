import { parse } from 'csv-parse'
import fs from 'fs'
import fr from 'follow-redirects'
const { http, https } = fr

export const utilService = {
    loadCSV,
    readJsonFile,
    download,
    httpGet,
}

function loadCSV(path) {
    return new Promise((resolve, reject) => {
        const animals = []
        fs.createReadStream(path)
            .pipe(parse({ columns: true, skip_empty_lines: true }))
            .on('data', row => animals.push(row))
            .on('end', () => resolve(animals))
            .on('error', reject)
    })
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, content => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}

function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET'
    }

    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, res => {
            let data = ''
            res.on('data', chunk => {
                data += chunk
            })

            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', err => {
            reject(err)
        })
        req.end()
    })
}
