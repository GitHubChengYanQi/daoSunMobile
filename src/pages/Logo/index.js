import huntsLogo from '../../assets/huntsLogo.png';
import hunts2Logo from '../../assets/hunts2Logo.png';
import daoxin from '../../assets/img.png';

export const Logo = () => {
  switch (process.env.ENV) {
    case 'test':
      return {
        logo1:huntsLogo,
        logo2:hunts2Logo,
      };
    case 'daoxin':
      return {
        logo1:huntsLogo,
        logo2:hunts2Logo,
      };
    case 'hunhe':
      return {
        logo1:huntsLogo,
        logo2:hunts2Logo,
      };
    default:
      return {};
  }
};
