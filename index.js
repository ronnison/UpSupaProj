const express = require('express')
const db = require('@supabase/supabase-js')
const multer = require('multer')
const csv = require('csv-parser')
const path = require('path')
const fs = require('fs')

const app = express()
const upload = multer({dest : 'uploads/'})
const url = process.env['URL']
const api = process.env['API']
const supabase = db.createClient(url, api)

app.get('/', (req,res) => {
  res.send('Hello World')
})

app.get('/upload', (req, res) => {
  res.sendFile('index.html', {root : __dirname})
})

const uploadRoute = (req, res) => {
  const file = req.file

  if(!file) {
    res.status(400).send('Nenhum arquivo foi enviado')
  }

  const results = []
  
  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (data) => {results.push(data)})
    .on('end', async (req, res) => {
      const {error} = await supabase  
        .from('usuario3')
        .insert(results)
      if(error){
        console.log('Problemas durante a inserção')
      }
    })
}

app.post('/upload', upload.single('csvFile'), uploadRoute)

app.listen(3000, () => {
  console.log('Executando....')
})