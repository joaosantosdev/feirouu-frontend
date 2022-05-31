const tabelaProdutos = {
    colunas: [
        {
            name: 'nome',
            required: true,
            label: 'Nome',
            align: 'left',
            sortable: true,
            field: 'nome',
        },
        {
            name: 'descricao',
            align: 'left',
            label: 'Descrição',
            field: 'descricao',
            sortable: true,
        },
        {
            name: 'valorCompra',
            align: 'left',
            label: 'Valor de compra',
            field: 'valorCompra',
            sortable: true,
        },
        {
            name: 'valorVenda',
            align: 'left',
            label: 'Valor de venda',
            field: 'valorVenda',
            sortable: true,
        },
    ],
};

export default tabelaProdutos;