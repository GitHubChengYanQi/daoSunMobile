const DefaultMenus = ({ userMenus = [], sysMenus = [] }) => {

  if (userMenus.length > 0) {
    return userMenus;
  } else {
    const defaultMenus = [];
    sysMenus.map((item, index) => {
      const subMenus = item.subMenus || [];
      if (subMenus.length === 0) {
        return null;
      }
      if (defaultMenus.length >= 8) {
        return null;
      }
      return defaultMenus.push({ code: item.id, name: item.name });
    });
    return defaultMenus;
  }
};

export default DefaultMenus;
