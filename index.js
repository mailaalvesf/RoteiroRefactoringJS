const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  //funcao nova aqui, substituida
  function calcularTotalApresentacao(apre, peca) {
    let total = 0;
    switch (peca.tipo) {
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
        throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
  }

  const formato = new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format;

  for (let apre of fatura.apresentacoes) {
    const peca = pecas[apre.id];
    
    // chama a nova funcao
    let total = calcularTotalApresentacao(apre, peca);

    // creditos de vol de publico
    creditos += Math.max(apre.audiencia - 30, 0);
    // crédito extra para comédias (10 para cada espectador)
    if ("comedia" === peca.tipo) creditos += Math.floor(apre.audiencia / 5);

    // formata a linha da fatura
    faturaStr += `  ${peca.nome}: ${formato(total / 100)} (${apre.audiencia} assentos)\n`;
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
