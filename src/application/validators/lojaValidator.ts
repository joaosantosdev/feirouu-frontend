import yup from './Validator';

export const lojaValidator = yup.object().shape({
    nome: yup.string().required().max(50).min(1),
    email: yup.string().required().email().max(150),
    descricao: yup.string().required().max(300).min(1),
    telefone: yup.string().required().max(11).min(11)
});
