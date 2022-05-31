const validar = function (validator: any, data: any): any {
  return validator.validate(data, { abortEarly: false })
    .then(() => {
      return {}
    }).catch((err: any) => {
      const errors: any = {};
      err.inner.forEach((item: any) => {
        errors[item.params.path] = item.message;
      });
      return errors;
    })
};
export default validar;