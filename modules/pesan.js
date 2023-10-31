module.exports = {
  sendItemList,

};

function sendItemList(client, message) {
  // Mengirim daftar item ke pengguna
  const listMessage = 'Daftar Item:\n1. Mobile Legends\n2. Pulsa';
  client.reply(message.from, listMessage, message.id);
}

