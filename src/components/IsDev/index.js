
const IsDev = () => {
  return ['song','ren','test'].includes(process.env.ENV);
};

export default IsDev;
