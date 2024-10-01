import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../api";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import productPicture from "../assets/products-media/productPicture.jpg";
import gsap from "gsap";

const color = "#FFFFFF";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { setCartItemsCount } = useCartContext();
  //prescription is a boolean
  const { name, description, prescription, price, id } = product;
  const { user, isLoggedIn } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    gsap.fromTo(
      card,
      {
        // opacity: 5,
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
      }
    );
  }, []);

  const handleProduct = async () => {
    //POST ITEM TO USERS CART IN THE DATABASE
    const cartObj = {
      user_id: user.id,
      product_id: id,
      quantity: 1,
    };
    console.log("cart", cartObj);
    if (isLoggedIn) {
      const product = await postData("/api/user/cart", cartObj);
      console.log("product", product);
      if (product) {
        setCartItemsCount((prevState) => prevState + 1);
      } else {
        setShowAlert(true);
      }
    } else {
      navigate("/login");
    }
  };
  console.log("user", user);

  return (
    <div>
      {/**HEADER */}
      <div>
        <h1>{name.toUpperCase()}</h1>
      </div>

      {/**IMAGE */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={productPicture} title="Product Image" />
      </div>
      {/**CONTENT */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <p>${price}</p>
          <div>
            {prescription ? (
              <p size="small">Need Prescription</p>
            ) : (
              <button onClick={handleProduct} size="small">
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
