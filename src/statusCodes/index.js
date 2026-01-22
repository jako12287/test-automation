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
};
