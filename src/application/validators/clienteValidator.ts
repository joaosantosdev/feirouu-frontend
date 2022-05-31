import yup from './Validator'

export const clienteValidator = yup.object().shape({
  nome: yup.string().required().max(50).min(1),
  email: yup.string().required().email().max(100).min(1),
  cpf: yup.string().required().max(11).min(11),
  telefone: yup.string().required().max(11).min(11)
});


