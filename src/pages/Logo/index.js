import huntsLogo from '../../assets/huntsLogo.png';
import hunts2Logo from '../../assets/hunts2Logo.png';
import { useModel } from 'umi';

export const LoginLogo = () => {
  const { initialState } = useModel('@@initialState');
  switch (initialState.logo) {
    case 'hunts':
      return huntsLogo;
    default:
      return huntsLogo;
  }
};

export const HomeLogo = () => {
  const { initialState } = useModel('@@initialState');
  if(initialState){
    switch (initialState.logo) {
      case 'hunts':
        return hunts2Logo;
      default:
        return hunts2Logo;
    }
  }else{
    return null;
  }

};

export const Logo = {
  LoginLogo,
  HomeLogo,
};
