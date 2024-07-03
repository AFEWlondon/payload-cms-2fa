export const checkOTPExpiration = (time: number) => {
  const now = new Date().getTime();
  if (time > now) {
    return true;
  }
  return false;
};
