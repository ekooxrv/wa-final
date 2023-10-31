// main.js

const venom = require('venom-bot');
const pesanModule = require('./modules/pesan.js');
const orderModule = require('./modules/order.js');
const itemModule = require('./modules/item.js');
const dataManipulation = require('./modules/dataManipulation.js');
const groupInfo = require('./modules/groupInfo.js'); // Require the new module

const allowedGroupID = '120363188500592314@g.us'; // Original group ID
const newGroupID = '120363178253564949@g.us'; // New group ID

venom
  .create({
    session: 'session-name'
  })
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg) {
      if (message.from === allowedGroupID) {
        // Handle all commands in the original group
        handleCommands(client, message, allowedGroupID);
      } else if (message.from === newGroupID) {
        // Handle only '.tambah' and '.hapus' commands in the new group
        if (message.body.startsWith('.tambah') || message.body.startsWith('.hapus')) {
          handleCommands(client, message, newGroupID);
        }
      }
    }
  });
}

function handleCommands(client, message, groupID) {
  const validCommands = ['.list', 'MENU', '.order', '.cek_status', 'ML', 'FF', 'PULSA', 'PLN', '.tambah', '.hapus', '.get_group_id', '.payment'];

  const isCommand = validCommands.some((command) => message.body.startsWith(command));

  if (isCommand) {
    if (message.body === 'MENU') {
      const pulsaData = require('./data-text/message.json');
      const listMessage = pulsaData.items.join('\n');
      client.sendText(message.from, listMessage);
    } else if (message.body.startsWith('.order')) {
      orderModule.handleOrderCommand(client, message);
    } else if (message.body.startsWith('.cek_status')) {
      orderModule.checkOrderStatus(client, message);
    } else if (message.body === 'ML') {
      sendJSONDataAsWhatsAppMessage(client, './produk/ml.json', message);
    } else if (message.body === 'FF') {
      sendJSONDataAsWhatsAppMessage(client, './produk/ff.json', message);
    } else if (message.body === 'PULSA') {
      sendJSONDataAsWhatsAppMessage(client, './produk/pulsa.json', message);
    } else if (message.body === 'PLN') {
      sendJSONDataAsWhatsAppMessage(client, './produk/pln.json', message);
    } else if (message.body.startsWith('.tambah') && groupID === newGroupID) {
      const parts = message.body.split(' ');
      if (parts.length >= 3) {
        const category = parts[1];
        const data = parts.slice(2).join(' ');
        dataManipulation.tambahDataKeKategoriProduk(client, message, category, data);
      } else {
        client.reply(message.from, 'Format tidak valid. Gunakan ".tambah <kategori> <data>" untuk menambahkan data.', message.id);
      }
    } else if (message.body.startsWith('.hapus') && groupID === newGroupID) {
      const parts = message.body.split(' ');
      if (parts.length >= 3) {
        const category = parts[1];
        const data = parts.slice(2).join(' ');
        dataManipulation.hapusDataDariKategoriProduk(client, message, category, data);
      } else {
        client.reply(message.from, 'Format tidak valid. Gunakan ".hapus <kategori> <data>" untuk menghapus data.', message.id);
      }
    } else if (message.body === '.get_group_id') {
      groupInfo.getGroupID(client, message);
    } else if (message.body === '.payment') {
      payment(client, message); // Handle the '.payment' command
    }
  }
}

function sendJSONDataFromFolder(client, filePath, message) {
  try {
    const jsonData = require(filePath);

    if (jsonData && jsonData.length > 0) {
      const listMessage = jsonData.join('\n');
      client.reply(message.from, listMessage, message.id);
    } else {
      client.reply(message.from, 'Tidak ada data yang tersedia', message.id);
    }
  } catch (error) {
    console.error(error);
    client.reply(message.from, 'Terjadi kesalahan saat mengambil data', message.id);
  }
}

function sendJSONDataAsWhatsAppMessage(client, filePath, message) {
  try {
    const jsonData = require(filePath);
    const items = jsonData.items;

    if (items && items.length > 0) {
      const listMessage = items.join('\n');
      client.reply(message.from, listMessage, message.id);
    } else {
      client.reply(message.from, 'Tidak ada data yang tersedia', message.id);
    }
  } catch (error) {
    console.error(error);
    client.reply(message.from, 'Terjadi kesalahan saat mengambil data', message.id);
  }
}

function payment(client, message) {
  // Respond with an image and description
  const imageUrl = './images/mia.jpg'; // Replace with the actual image URL
  const description = 'TEMPEK BOLONG';

  client.sendImage(message.from, imageUrl, 'payment-image', description);
}
