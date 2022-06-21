
const IsDev = () => {
  return ['song','ren'].includes(process.env.ENV);
};

export default IsDev;
