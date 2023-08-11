import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";

const caixa = new CaixaDaLanchonete();

console.log(caixa.calcularValorDaCompra("dinheiro", ["combo1,1", "cafe,2"]));
