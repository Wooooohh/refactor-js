function statement (invoice, plays) {
  let amounts = calculateAmounts(plays,invoice);
  return createHtmlStatement(plays, amounts, invoice);
}

function playFor(plays, perf){
  return plays[perf.playID];
}

function calculateTotalAmount(amounts){
    let totalAmount = 0;
    for(let i = 0; i < amounts.length; i++){
        totalAmount += amounts[i];
    }
    return totalAmount;
}

function createHtmlStatement(plays, amounts, invoice){
  let result = `<h1>Statement for ${invoice.customer}</h1>\n<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr>\n`;
  let index = 0;
  const format = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format;
  for(let perf of invoice.performances){
      const play = playFor(plays, perf);
      let thisAmount = amounts[index++]
      result += ` <tr><td>${play.name}</td><td>${perf.audience}</td><td>${format(thisAmount / 100)}</td></tr>\n`
   }
  result += `</table>\n<p>Amount owed is <em>${format(calculateTotalAmount(amounts) / 100)}</em></p>\n<p>You earned <em>${calculateVolumeCredits(plays, invoice)}</em> credits</p>\n`;
   return result;
}

function createStatement(plays, amounts, invoice){
  let result = `Statement for ${invoice.customer}\n`;
  let index = 0;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    let thisAmount = amounts[index++]
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${format(calculateTotalAmount(amounts) / 100)}\n`;
  result += `You earned ${calculateVolumeCredits(plays, invoice)} credits \n`;
  return result;
}

function calculateAmounts(plays,invoice){
    let amounts = [];
    for (let perf of invoice.performances) {
      const play = playFor(plays, perf);
      let thisAmount = calculateAmount(play, perf);
      amounts.push(thisAmount);
    }
    return amounts;
}

function calculateVolumeCredits(plays, invoice){
    let totalVolumeCredits = 0;
    for (let perf of invoice.performances) {
      const play = playFor(plays, perf);
      totalVolumeCredits += Math.max(perf.audience - 30, 0);
      if ('comedy' === play.type) totalVolumeCredits += Math.floor(perf.audience / 5);
    }
    return totalVolumeCredits;
}

function calculateAmount(play, performance){
    let perf = performance;
    let thisAmount = 0;
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
      }
    return thisAmount;
}

module.exports = {
  statement,
};
