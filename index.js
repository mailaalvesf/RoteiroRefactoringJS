const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  // Função query adicionada
  function getPeca(apresentacao) {
    return pecas[apresentacao.id];
  }

  // A função agora recebe apenas 'apre'
  function calcularTotalApresentacao(apre) {
    let total = 0;
    // Uso de getPeca(apre) em vez de peca
    switch (getPeca(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecida: ${getPeca(apre).tipo}`);
    }
    return total;
  }

  const formato = new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format;

  for (let apre of fatura.apresentacoes) {
    // A variável 'const peca = pecas[apre.id];' foi removida!
    
    // Passamos apenas 'apre'
    let total = calcularTotalApresentacao(apre);

    // créditos para volume de público
    creditos += Math.max(apre.audiencia - 30, 0);
    // crédito extra para comédias usando a query getPeca
    if ("comedia" === getPeca(apre).tipo) creditos += Math.floor(apre.audiencia / 5);

    // formata a linha da fatura usando a query getPeca
    faturaStr += `  ${getPeca(apre).nome}: ${formato(total / 100)} (${apre.audiencia} assentos)\n`;
    totalFatura += total;
  }
  
  faturaStr += `Valor total: ${formato(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos}\n`;
  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
