const DefaultMenus = ({ userMenus = [], sysMenus = [] }) => {

  if (userMenus.length > 0) {
    return userMenus;
  } else {
    const defaultMenus = [];
    sysMenus.map((item, index) => {
      if (index >= 8) {
        return null;
      }
      return defaultMenus.push({ code: item.id, name: item.name });
    });
    return defaultMenus;
  }
};

export default DefaultMenus;
