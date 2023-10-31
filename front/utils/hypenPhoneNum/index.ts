const hypenPhoneNum = (payload: string) => {
  return payload.replace(/(\d{3})(\d{4})(\d{4})/g,'$1-$2-$3');
};

export default hypenPhoneNum;