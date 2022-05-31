import yup from './Validator';

export const produtoValidator = yup.object().shape({
    nome: yup.string().required().max(50).min(1),
    descricao: yup.string().required().max(50).min(1),
    valorCompra: yup.number().required().min(1),
    valorVenda: yup.number().required().min(1),
    status: yup.number().required().min(1)

});
