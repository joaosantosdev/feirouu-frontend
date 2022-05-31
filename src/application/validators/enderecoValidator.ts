import yup from './Validator';

export const enderecoValidator = yup.object().shape({
    bairro: yup.string().required().max(100).min(1),
    rua: yup.string().required().max(100).min(1),
    cep: yup.string().required().max(11).min(0),
    complemento: yup.string().required().max(100).min(1),
    cidadeId: yup.number().required(),
    estadoId: yup.number().required(),
    numero: yup.string().required().max(30).min(1),
});
