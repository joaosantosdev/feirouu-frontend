import yup from './Validator';

export const movimentacaoEntradaValidator = yup.object().shape({
    quantidade: yup.number().required().max(1000).min(1)
});

export const movimentacaoSaidaValidator = yup.object().shape({
    quantidade: yup.number().required().max(1000).min(1),
    valorDesconto: yup.number()
});

export const movimentacaoDevolucaoValidator = yup.object().shape({
    quantidade: yup.number().required().max(1000).min(1),
    movimentacaoReferenciaId: yup.number().required()
});