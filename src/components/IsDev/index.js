
const IsDev = () => {
  return process.env.ENV === 'test';
};

export default IsDev;
