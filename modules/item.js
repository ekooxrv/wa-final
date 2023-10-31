const fs = require('fs');

module.exports = {
  getItemList,
};

function getItemList(itemCategory) {
  const filePath = `./produk/${itemCategory}.json`;

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      if (jsonData && jsonData.items && jsonData.items.length > 0) {
        const itemList = jsonData.items.join('\n');
        return itemList;
      } else {
        return 'Tidak ada item yang tersedia.';
      }
    } else {
      return 'File tidak ditemukan.';
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Terjadi kesalahan dalam membaca data item.';
  }
}
