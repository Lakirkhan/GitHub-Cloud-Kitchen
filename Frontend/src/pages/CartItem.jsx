// // src/components/CartItem.jsx

// import React from "react";

// const CartItem = ({ item, onRemove, onQuantityChange }) => {
//   return (
//     <div className="flex items-center justify-between border-b p-3">
//       <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
//       <div className="flex-1 ml-4">
//         <h3 className="text-lg font-semibold">{item.name}</h3>
//         <p className="text-gray-600">${item.price}</p>
//         <div className="flex items-center mt-2">
//           <button
//             className="px-2 py-1 bg-gray-300 rounded"
//             onClick={() => onQuantityChange(item.id, item.quantity - 1)}
//             disabled={item.quantity <= 1}
//           >
//             -
//           </button>
//           <span className="mx-2">{item.quantity}</span>
//           <button
//             className="px-2 py-1 bg-gray-300 rounded"
//             onClick={() => onQuantityChange(item.id, item.quantity + 1)}
//           >
//             +
//           </button>
//         </div>
//       </div>
//       <button
//         className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
//         onClick={() => onRemove(item.id)}
//       >
//         Remove
//       </button>
//     </div>
//   );
// };

// export default CartItem;


// src/components/CartItem.jsx

import React from "react";
import foodData from "./foodData";
const CartItem = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            className="px-2 py-1 bg-gray-300 rounded"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="mx-2">{item.quantity}</span>
          <button
            className="px-2 py-1 bg-gray-300 rounded"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <button
        className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
