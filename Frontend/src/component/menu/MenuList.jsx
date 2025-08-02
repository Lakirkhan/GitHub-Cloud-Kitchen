import MenuItem from "./MenuItem";

const MenuList = ({ menuItems }) => {
  
  return (
    <div className="menu-list-container">
      {menuItems.length > 0 ? (
        menuItems.map((item) => <MenuItem key={item.id} item={item}  />)
      ) : (
        <p className="menu-list-empty">No menu items available.</p>
      )}
    </div>
  );
};

export default MenuList;
