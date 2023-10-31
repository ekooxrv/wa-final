const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

const apiKey = '041d6f82-c3f9-5100-9012-0671ce41f998';
const username = 'gefuloDRXEEg';
const allowedGroupID = '120363188500592314@g.us'; // Original group ID
const allowedNumbers = ['+62895412399640', '62895412399640@c.us', '+6281268268436', '6281268268436@c.us'];

let ordersData = [];

if (fs.existsSync('./history-tx/orders.json')) {
  const data = fs.readFileSync('./history-tx/orders.json', 'utf8');
  if (data) {
    ordersData = JSON.parse(data);
  }
}

module.exports = {
  handleOrderCommand,
  checkOrderStatus,
};

function handleOrderCommand(client, message) {
  if (allowedNumbers.includes(message.author)) {
    const messageParts = message.body.split(' ');
    if (messageParts.length >= 3) {
      const buyerSkuCode = messageParts[1];
      const nomorBuyer = messageParts[2];
      const additionalParams = messageParts.slice(3).join('');
      const prefix = 'MS';
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const reffId = prefix + randomNumber;
      const signData = username + apiKey + reffId;
      const sign = crypto.createHash('md5').update(signData).digest('hex');
      const id_game = nomorBuyer.slice(0, nomorBuyer.length - 4);
      const server_game = nomorBuyer.slice(-4);

      let responseDataA;
      let responseDataB = {};

      const requestDataA = {
        username: username,
        buyer_sku_code: buyerSkuCode,
        customer_no: nomorBuyer,
        ref_id: reffId,
        sign: sign,
      };

      axios.post('https://api.digiflazz.com/v1/transaction', requestDataA)
        .then(async (responseA) => {
          responseDataA = responseA.data && responseA.data.data;

          if (!responseDataA) {
            throw new Error('Invalid or missing data in API response A');
          }

          if (buyerSkuCode.includes('ML')) {
            const requestDataB = new URLSearchParams();
            requestDataB.append('key', 'FXfgGWzuTpCCcTYVI8OOz2h05BMefq23qIOtF6NGNco3mO4kAZ9gYS7ITH0ceFcv');
            requestDataB.append('sign', '0ef4686aecafb573d4b8ddad2bf5f724');
            requestDataB.append('type', 'get-nickname');
            requestDataB.append('code', 'mobile-legends');
            requestDataB.append('target', id_game);
            requestDataB.append('additional_target', server_game);

            // Configuration for the API B request
            const configB = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            };

            return axios.post('https://vip-reseller.co.id/api/game-feature', requestDataB, configB);
          } else {
            return Promise.resolve({ data: '' }); // Skip the API call for non-ML SKUs
          }
        })
        .then((responseB) => {
          if (buyerSkuCode.includes('ML')) {
            responseDataB = responseB.data;
          }

          const currentTime = new Date();
          const formattedDate = `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()}`;
          const hours = currentTime.getHours().toString().padStart(2, '0');
          const minutes = currentTime.getMinutes().toString().padStart(2, '0');
          const formattedTime = `${hours}:${minutes}`;

          const messageData = fs.readFileSync('./data-text/responseMessage.json', 'utf8');
          const jsonData = JSON.parse(messageData);
          let responseMessage = jsonData.responseMessage
            .replace('[Tanggal Anda]', formattedDate)
            .replace('[Jam Anda]', formattedTime)
            .replace('[ref_id]', reffId)
            .replace('[customer_no]', nomorBuyer)
            .replace('[buyer_sku_code]', buyerSkuCode)
            .replace('[price]', responseDataA.price)
            .replace('[status]', responseDataA.status)
            .replace('[message]', responseDataA.message);

          if (buyerSkuCode.includes('ML')) {
            responseMessage = responseMessage.replace('[game_name]', responseDataB.data);
          } else {
            responseMessage = responseMessage.replace('[game_name]', '-'); // Set game name to an empty string if not ML
          }

          console.log(responseMessage);
          console.log('Response Data A:', responseDataA);
          console.log('Response Data B:', responseDataB);
          client.reply(allowedGroupID, responseMessage, message.id);

          ordersData.push({
            ref_id: reffId,
            customer_no: nomorBuyer,
            buyer_sku_code: buyerSkuCode,
            additional_params: additionalParams,
            status: responseDataA.status,
            sign: sign,
            sn: responseDataA.sn,
            nickgame: responseDataB.data,
          });

          fs.writeFileSync('./history-tx/orders.json', JSON.stringify(ordersData, null, 2));
        })
        .catch((error) => {
          console.error('Error:', error.message);
          const errorMessage = error.message || 'Terjadi kesalahan dalam pemrosesan pesanan.';
          client.reply(message.from, `Maaf, ${errorMessage}`, message.id);
        });
    }
  } else {
    client.reply(message.from, 'Anda tidak diizinkan melakukan pemesanan.', message.id);
  }
}

function checkOrderStatus(client, message) {
  // Implement the function to check order status based on the ordersData array
  // ...
}

// Other related functions and configurations
