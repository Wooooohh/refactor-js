function statement (invoice, plays) {
  let volumeCredits = calculateVolumeCredits(plays, invoice);
  let amounts = calculateAmounts(plays,invoice)
  return createStatement(plays, volumeCredits, amounts, invoice);
}

function playFor(plays, perf){
    return plays[perf.playID];
}

function createStatement(plays, volumeCredits, amounts, invoice){
  let result = `Statement for ${invoice.customer}\n`;
  let totalAmount = 0;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  let i = 0;
  for (let perf of invoice.performances) {
    const play = playFor(plays, perf);
    let thisAmount = amounts[i++]
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
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
        // add extra credit for every ten comedy attendees
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
