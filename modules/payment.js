
function pay(client, message) {
  // Simpan URL gambar dan deskripsi yang akan dikirim
  const imageUrl = './images/mia.jpg'; // Ganti dengan URL gambar yang sesuai
  const description = 'Pembayaran telah diterima. Terima kasih!'; // Ganti dengan deskripsi yang sesuai

  // Kirim gambar sebagai pesan
  client
    .sendImage(message.from, imageUrl, 'payment-image.png', description)
    .then(() => {
      console.log('Gambar pembayaran berhasil dikirim.');
    })
    .catch((error) => {
      console.error('Gagal mengirim gambar pembayaran:', error);
    });
}

module.exports = { pay };
