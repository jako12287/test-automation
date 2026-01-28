export const listCode = {
  offsetError: {
    status: 400,
    message: "offset debe ser un valor positivo entre 0 y 99",
  },
  limitError: {
    status: 400,
    message: "Limit debe estar entre 1 y 49",
  },
  isNotuudd: {
    message: "El id suministrado no es valido",
    status: 400,
  },
  userExist: {
    message: "Usuario not found",
    status: 404,
  },
  getAllUsersError: {
    status: 500,
    message: "Error al obtener todos los usuarios",
  },
  getUserByIdError: {
    status: 500,
    message: "Error al obtener el usuario",
  },
  createUserNoNameOrEmailError: {
    message: "Verifica el nombre y/o el email del usuario no pueden ir vacios",
    status: 400,
  },
  createUSerEmailInvalidError: {
    message: "Email invalido",
    status: 400,
  },
  createUSerNameInvalidError: {
    message: "Nombre invalido",
    status: 400,
  },
  emailAlreadyExists: {
    status: 409,
    message: "El email ya existe",
  },
  updateNoBody: {
    status: 400,
    message: "Se necesita el nombre, email o el status del usuario para actualizar",
  },
  isNotBoolean: {
    status: 400,
    message: "Se necesita que el status sea un boolean valido",
  },
  verifyCredentials:{
    status:404,
    message:"Verifica las credenciales, el email o el password no son correctos"
  },
  verifyPass:{
    status:404,
    message:"La contrasena debe ser minimo de 6 caracteres"

  }

};
