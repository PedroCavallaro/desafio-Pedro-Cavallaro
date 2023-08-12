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
        try {
            if (!metodoDePagamento)
                throw new Error("Método de pagamento necessário");
            if (!(metodoDePagamento in this.PaymentMethods))
                throw new Error("Forma de pagamento inválida!");
            if (!itens.length)
                throw new Error("Não há itens no carrinho de compra!");

            let totalValue = 0;
            const buy = Array.from(itens, (item) => {
                const qtd = Number(item.split(",")[1]);
                const codItem = item.split(",")[0];

                const retrievedItem = this.Itens.find((e) => e.cod === codItem);

                if (qtd === 0) throw new Error("Quantidade inválida!");
                if (!retrievedItem) throw new Error("Item inválido!");

                totalValue += qtd * Number(retrievedItem.value);

                return { ...retrievedItem, qtd };
            });

            buy.forEach((item) => {
                if (item.parent) {
                    const isValid = buy.find((e) => e.cod === item.parent);

                    if (!isValid) {
                        throw new Error(
                            "Item extra não pode ser pedido sem o principal"
                        );
                    }
                }
            });

            return `R$ ${this.adjustValue(totalValue, metodoDePagamento)
                .toFixed(2)
                .replace(".", ",")}`;
        } catch (err) {
            return err.message;
        }
    }
    get PaymentMethods() {
        return this.#paymentMethods;
    }
    get Itens() {
        return this.#savedItens;
    }
    adjustValue(totalValue, method) {
        switch (method) {
            case this.PaymentMethods.credito:
                totalValue += totalValue * 0.03;
                break;
            case this.PaymentMethods.dinheiro:
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
