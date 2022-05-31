import yup from './Validator'

export const cadastroValidator = yup.object().shape({
  nome: yup.string().required().max(50).min(1),
  email: yup.string().required().email().max(100),
  senha: yup.string().required().max(100).min(8),
  rSenha: yup.string().required().max(100).min(8),
  telefone: yup.string().required().max(11).min(0)
});


export const codigoVerificacaoValidator = yup.object().shape({
  codigoVerificacao: yup.string().required().max(11).min(0)
});

export const autenticarValidator = yup.object().shape({
  email: yup.string().required().email().max(100),
  senha: yup.string().required().max(100).min(8),
});

export const usuarioAtualizacaoValidator = yup.object().shape({
  nome: yup.string().required().max(50).min(1),
  email: yup.string().required().email().max(100),
  senha: yup.string().nullable().max(100).min(8),
  rSenha: yup.string().nullable().max(100).min(8),
  telefone: yup.string().required().max(11).min(0)
});

export const redefinicaoSenhaValidator = yup.object().shape({
  email: yup.string().required().email().max(100),
  senha: yup.string().required().max(100).min(8),
  rSenha: yup.string().required().max(100).min(8)
});