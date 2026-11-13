const { readFileSync } = require('fs');

module.exports = class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json', 'utf8'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}