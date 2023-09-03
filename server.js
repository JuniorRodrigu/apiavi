const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
var buffer = ["null", "null", "null", "null", "null", "null", "null", "null", "null", "null"];

async function logar_site() {
  const user = 'pabloapi';
  const password = 'PabloAPI123@';
  var dois_ultimos = ["", ""];

  const urlLogin = "https://central.primoos.bet/api/auth/signin";
  const payloadLogin = `{"username":"${user}","password":"${password}","cookie":""}`;

  const headersLogin = {
    "Content-Type": "application/json",
    "Origin": "https://primoos.bet",
    "Referer": "https://primoos.bet/"
  };

  console.log("Fazendo login...");
  const { default: fetch } = await import('node-fetch'); // Importação dinâmica

  const responseLogin = await fetch(urlLogin, {
    method: 'POST',
    headers: headersLogin,
    body: payloadLogin
  });
  const dadosLogin = await responseLogin.json();

  console.log("Resposta do login:", dadosLogin);

  if (dadosLogin.token) {
    const tokenCassino = dadosLogin.tokenCassino;
    const gameUrl = `https://api.salsagator.com/game?token=${tokenCassino}&pn=primoos&lang=pt&game=spb-tb-aviator&currency=BRL&type=CHARGE`;

    console.log("Realizando requisição para o URL do jogo:", gameUrl);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(gameUrl);
    await page.waitForTimeout(5000);
    await page.waitForTimeout(9000);
    var iframeElement = await page.$('#gm-frm');
    var iframe = null;

    if (iframeElement) {
      iframe = await page.evaluate((element) => element.src, iframeElement);
    }

    await page.waitForSelector('.payouts-block');

    while (true) {
      try {
        const _payouts = await page.$('.payouts-block');
        const payouts = await _payouts.$$('.payout');
        var x = [await payouts[0].evaluate((node) => node.innerText), await payouts[2].evaluate((node) => node.innerText)];
        x = x.map(elemento => elemento.replace("x", ""));

        if (x.toString() !== dois_ultimos.toString()) {
          dois_ultimos = [...x];
          variavel = dois_ultimos[0];

          buffer[9] = buffer[8];
          buffer[8] = buffer[7];
          buffer[7] = buffer[6];
          buffer[6] = buffer[5];
          buffer[5] = buffer[4];
          buffer[4] = buffer[3];
          buffer[3] = buffer[2];
          buffer[2] = buffer[1];
          buffer[1] = buffer[0];
          buffer[0] = `${dois_ultimos[0]}`;

          console.log(buffer);
        }
      } catch (e) {
        console.log(e);
        await page.waitForTimeout(3000);
      }
    }
  } else {
    console.log("Falha no login. Não foi possível obter o token de autenticação.");
  }
}

logar_site();

// Inicia o servidor
app.listen(3010, () => {
  console.log('Servidor iniciado na porta 3010');
});

app.get('/aviator-results', (req, res) => {
  res.json({ results: buffer });
});
