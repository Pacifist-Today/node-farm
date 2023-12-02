// import replaceTemplate from "./modules/replaceTemplate";

const fs = require('fs')
const http = require('http')
const url = require('url')

const slugify = require('slugify')

const replaceTemplate = require('./modules/replaceTemplate')

// Files

// // Blocking, synchronous
//
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
//
// const textOut = `Some important message ${textIn}, \nCreated ${Date.now()}`
//
// fs.writeFileSync('./txt/output.txt', textOut, 'utf-8')
//
// // Non-blocking, asynchronous
//
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         // console.log(data2)
//         fs.readFile(`./txt/${data2}.txt`, 'utf-8', (err, data3) => {
//             // console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2} \n${data3}`, (err => {
//                 console.log(`${data2} \n ${data3}`)
//                 console.log('Your file has been written')
//             }))
//         })
//     })
// })
//
// console.log("will read file")

//Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))

console.log(slugify('Fresh avocados', { lowercase: true }))

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    //Overview page
    if (pathname === "/" || pathname === "/overview"){
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHTML)
        // res.end(tempOverview)
        res.end(output)
    //Product page
    } else if (pathname === "/product") {
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(output)
    //API page
    } else if (pathname === "/api"){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        })
        res.end("<h1>Page not found</h1>")
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('listening to requests on port 8000')
})