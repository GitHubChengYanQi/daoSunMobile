


const project = 'daoxin';
// const project = 'zjzc';

export const Config = () => {
  switch (project) {
    case 'daoxin':
      return {
        api:'https://api.daoxin.gf2025.com',
        code:'https://wx.daoxin.gf2025.com/cp/#/OrCode',
      };
    case 'zjzc':
      return {
        api:'https://api.zjzc.gf2025.com',
        code:'https://wx.zjzc.gf2025.com/cp/#/OrCode',
      };
    default:
      break;
  }
}
