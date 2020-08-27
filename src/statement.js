function statement (invoice, plays) {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  let volumeCredits = calculateVolumeCredits(plays,invoice);
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    // add volume credits
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function calculateVolumeCredits(plays, invoice){
    let totalVolumeCredits = 0;
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
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
