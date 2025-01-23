const express = require('express');
const fs = require('fs');
const realizarScraping = require('./scraping');

const app = express();
const PORT = 3000;

let noticias = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

app.get('/scraping', async (req, res) => {
  await realizarScraping();
  leerDatos();
  res.send('Scraping completado y datos guardados.');
});

app.get('/noticias', (req, res) => {
  leerDatos();
  res.json(noticias);
});

app.get('/noticias/:id', (req, res) => {
  leerDatos();
  const id = parseInt(req.params.id, 10);
  if (id >= 0 && id < noticias.length) {
    res.json(noticias[id]);
  } else {
    res.status(404).send('Noticia no encontrada.');
  }
});

app.post('/noticias', (req, res) => {
  const nuevaNoticia = req.body;
  if (nuevaNoticia.titulo && nuevaNoticia.enlace) {
    leerDatos();
    noticias.push(nuevaNoticia);
    guardarDatos();
    res.status(201).send('Noticia creada.');
  } else {
    res.status(400).send('Faltan campos obligatorios.');
  }
});

app.put('/noticias/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  leerDatos();
  if (id >= 0 && id < noticias.length) {
    const noticiaActualizada = req.body;
    noticias[id] = { ...noticias[id], ...noticiaActualizada };
    guardarDatos();
    res.send('Noticia actualizada.');
  } else {
    res.status(404).send('Noticia no encontrada.');
  }
});

app.delete('/noticias/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  leerDatos();
  if (id >= 0 && id < noticias.length) {
    noticias.splice(id, 1);
    guardarDatos();
    res.send('Noticia eliminada.');
  } else {
    res.status(404).send('Noticia no encontrada.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
