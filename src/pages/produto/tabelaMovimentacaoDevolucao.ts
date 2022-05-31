const tabelaMovimentacaoDevolucao = {
    colunas: [
        {
            name: 'id',
            required: true,
            label: 'ID',
            align: 'left',
            sortable: true,
            field: 'id',
        },
        {
            name: 'nome',
            required: true,
            label: 'Nome',
            align: 'left',
            sortable: true,
            field: 'produtoNome',
        },
        {
            name: 'quantidade',
            align: 'left',
            label: 'Quantidade',
            field: 'quantidade',
            sortable: true,
        },
        {
            name: 'valorVenda',
            align: 'left',
            label: 'Valor de venda',
            field: 'valorVenda',
            sortable: true,
        },
        {
            name: 'dataHora',
            align: 'left',
            label: 'Data e Hora',
            field: 'dataHora',
            sortable: true,
        },

    ],
};

export default tabelaMovimentacaoDevolucao;