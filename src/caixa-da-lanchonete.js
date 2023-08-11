import { Product } from "./entities/Product.js";
class CaixaDaLanchonete {
    #paymentMethods = {
        debito: "debito",
        credito: "credito",
        dinheiro: "dinheiro",
    };
    #savedItens = [
        new Product("cafe", "Café", 3.0, ""),
        new Product("chantily", "Chantily (extra do Café)", 1.5, "cafe"),
        new Product("suco", "Suco Natural ", 6.2, ""),
        new Product("sanduiche", "Sanduíche", 6.5, ""),
        new Product("queijo", "Queijo (extra do Sanduíche)", 2.0, "sanduiche"),
        new Product("salgado", "Salgado", 7.25, ""),
        new Product("combo1", "1 Suco e 1 Sanduíche ", 9.5, ""),
        new Product("combo2", "1 Café e 1 Sanduíche ", 7.5, ""),
    ];
    calcularValorDaCompra(metodoDePagamento, itens) {
        if (!metodoDePagamento) return "Método de pagamento necessário";
        if (!(metodoDePagamento in this.getPaymentMethods()))
            return "Forma de pagamento inválida!";
        if (!itens.length) return "Não há itens no carrinho de compra!";

        let message = "";
        let totalValue = 0;
        const buy = Array.from(itens, (item) => {
            const qtd = Number(item.split(",")[1]);
            const codItem = item.split(",")[0];

            const retrievedItem = this.getItens().find(
                (e) => e.cod === codItem
            );

            if (qtd === 0) message = "Quantidade inválida!";
            if (!retrievedItem) message = "Item inválido!";

            totalValue += qtd * Number(retrievedItem?.value);

            return { ...retrievedItem, qtd };
        });

        buy.forEach((item) => {
            if (item.parent) {
                const isValid = buy.find((e) => e.cod === item.parent);

                if (!isValid) {
                    message = "Item extra não pode ser pedido sem o principal";
                }
            }
        });

        if (!message) {
            message = `R$ ${this.adjustValue(totalValue, metodoDePagamento)
                .toFixed(2)
                .replace(".", ",")}`;
        }
        return message;
    }
    getPaymentMethods() {
        return this.#paymentMethods;
    }
    getItens() {
        return this.#savedItens;
    }
    adjustValue(totalValue, method) {
        switch (method) {
            case this.getPaymentMethods().credito:
                totalValue += totalValue * (3 / 100);
                break;
            case this.getPaymentMethods().dinheiro:
                totalValue -= totalValue * 0.05;
                break;
        }

        return totalValue;
    }
}

export { CaixaDaLanchonete };

//   | codigo    | descrição                   | valor   |
//   |-----------|-----------------------------|---------|
//   | cafe      | Café                        | R$ 3,00 |
//   | chantily  | Chantily (extra do Café)    | R$ 1,50 |
//   | suco      | Suco Natural                | R$ 6,20 |
//   | sanduiche | Sanduíche                   | R$ 6,50 |
//   | queijo    | Queijo (extra do Sanduíche) | R$ 2,00 |
//   | salgado   | Salgado                     | R$ 7,25 |
//   | combo1    | 1 Suco e 1 Sanduíche        | R$ 9,50 |
//   | combo2    | 1 Café e 1 Sanduíche        | R$ 7,50 |
