import React, { useEffect, useState } from "react";
import { fetchVendors } from "../AdminApi/vendorfetch";

const Inventory = () => {
  const [vendors, setVendors] = useState([]);
  const fetchdata = async () => {
    try {
      const response = await fetchVendors();
      console.log("Response from fetchVendors:", response.data);
      setVendors(response.data);
    } catch (error) {
      console.log("Error fetching vendors:", error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>
    </div>
  );
};

export default Inventory;
