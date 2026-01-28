import "dotenv/config";

export const saltRounds = 10;
export const myPlaintextPassword = process.env.BCRYPT_MYPLAINTEXTPASSWORD;
