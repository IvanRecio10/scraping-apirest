const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function realizarScraping() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let noticias = [];

    $('article.c').each((index, element) => {
      const titulo = $(element).find('header.c_h a').text().trim();
      const enlace = $(element).find('header.c_h a').attr('href');
      const descripcion = $(element).find('p.c_d').text().trim();
      const imagen = $(element).find('figure img').attr('src');

      if (titulo && enlace) {
        noticias.push({
          titulo,
          descripcion: descripcion || 'No disponible',
          imagen: imagen || 'No disponible',
          enlace: enlace.startsWith('http') ? enlace : `https://elpais.com${enlace}`,
        });
      }
    });

    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    console.log('Scraping completado. Noticias guardadas en noticias.json.');
  } catch (error) {
    console.error('Error al realizar el scraping:', error.message);
  }
}

module.exports = realizarScraping;
