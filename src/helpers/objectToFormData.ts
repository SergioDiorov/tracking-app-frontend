export const objectToFormData = (data: { [key: string]: any }): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  return formData;
};
