
const fs = require('fs');

function tambahDataKeKategoriProduk(client, message, kategori, data) {
  const filePath = `../produk/${kategori}.json`;
  try {
    let jsonData = require(filePath);
    jsonData.items.push(data);
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    client.reply(message.from, `Data ditambahkan ke kategori ${kategori}: ${data}`, message.id);
  } catch (error) {
    console.error(error);
    client.reply(message.from, `Terjadi kesalahan saat menambahkan data ke kategori ${kategori}`, message.id);
  }
}

function hapusDataDariKategoriProduk(client, message, kategori, data) {
  const filePath = `../produk/${kategori}.json`;
  try {
    let jsonData = require(filePath);
    const index = jsonData.items.indexOf(data);
    if (index !== -1) {
      jsonData.items.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      client.reply(message.from, `Data dihapus dari kategori ${kategori}: ${data}`, message.id);
    } else {
      client.reply(message.from, `Data tidak ditemukan dalam kategori ${kategori}: ${data}`, message.id);
    }
  } catch (error) {
    console.error(error);
    client.reply(message.from, `Terjadi kesalahan saat menghapus data dari kategori ${kategori}`, message.id);
  }
}

module.exports = {
  tambahDataKeKategoriProduk,
  hapusDataDariKategoriProduk
};
