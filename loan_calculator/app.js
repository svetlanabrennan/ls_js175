const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `
        </tbody>
      </table>
    </article>
  </body>
</html>`;

function getParams(path) {
  const myUrl = new URL(path, `http://localhost:${PORT}`);
  return myUrl.searchParams; // { amount: 5000, duration: 10}
}

function calculateLoan(amount, duration, apr) {
  let monthlyAPR = (apr / 100) / 12;
  let durMonths = duration * 12;

  let monthly = amount * (monthlyAPR / (1 - Math.pow((1 + monthlyAPR), (-durMonths))));
  return monthly.toFixed(2)
}

function loanDetails(paramObj) {
  const APR = 5;
  let amount = Number(paramObj.get("amount"));
  let duration = Number(paramObj.get("duration"));
  let payment = calculateLoan(amount, duration, APR);

  let content = `<tr><th>Amount:</th><td>$${amount}</td></tr>
  <tr><th>Duration:</th><td>${duration} years</td></tr>
  <tr><th>APR:</th><td>${APR}%</td></tr>
  <tr><th>Monthly payment:</th><td>$${payment}</td></tr>`;

  return `${HTML_START}${content}${HTML_END}`;
}

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {
    let content = loanDetails(getParams(path));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(`${content}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});