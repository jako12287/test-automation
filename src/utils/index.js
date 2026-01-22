export const isNumber = (parameter) => {
  const number = Number(parameter);
  if (isNaN(number)) {
    return undefined;
  }
  return number;
};

export const isboolean = {
  false: false,
  true: true,
};

export const isValidUUID = (uuid) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

export const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

  return regex.test(email);
};

export const isNameValid =(name)=>{

 const isvalid = (name.trim().length >= 2)


    return isvalid

}
