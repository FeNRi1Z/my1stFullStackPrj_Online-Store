import React, { useEffect, useState } from "react";

import axios from "axios";

import config from "../config";

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]); // topProducts = [{id, name, quantitySold}, ...] fetch from server
  const [loading, setLoading] = useState(true); // loading state for holding the loading status

  useEffect(() => {
    /*
      // Fetch top 10 most sold products from the server
    */
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get(config.apiPath + "/product/stat/topProduct", config.headers());
        setTopProducts(response.data.results);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4" style={{fontWeight:'normal'}}>Top 10 Most Sold Product</h4>
      <div className="table-responsive">
        <table className="table table-responsive-sm table-hover table-striped align-middle table-bordered table-responsive-xl table-responsive-md table-responsive-lg">
          <thead className="table-secondary">
            <tr>
              <th width='5px' className="text-center">Rank</th>
              <th width='50px' className="text-left wrapper">Product Name</th>
              <th width='5px' className="text-center">Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={product.id} className={index === 0 ? "table-success" : index === 1 ? "table-warning" : ""}>
                <td><div width='5px' className='text-center'>{index + 1}</div></td>
                <td><div width='50px' className='text-left'>{product.name}</div></td>
                <td><div width='5px' className='text-center'>{product.quantitySold}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;
