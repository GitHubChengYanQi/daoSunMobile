


const project = 'daoxin';
// const project = 'zjzc';

export const Config = () => {
  switch (project) {
    case 'daoxin':
      return {
        api:'https://api.daoxin.gf2025.com',
        wxCp:'https://wx.daoxin.gf2025.com/cp/#/',
      };
    case 'zjzc':
      return {
        api:'https://api.zjzc.gf2025.com',
        wxCp:'https://wx.zjzc.gf2025.com/cp/#/OrCode',
      };
    default:
      break;
  }
}
