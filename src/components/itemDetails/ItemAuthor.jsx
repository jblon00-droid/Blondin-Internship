import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";

// Owner/creator row on the Item Details page. Shows skeletons until loaded.
const ItemAuthor = ({ label, authorId, name, image, loading }) => {
  return (
    <>
      <h6>{label}</h6>
      <div className="item_author">
        <div className="author_list_pp">
          {loading ? (
            <Skeleton width="50px" height="50px" borderRadius="50%" />
          ) : (
            <Link to={`/author/${authorId}`}>
              <img className="lazy" src={image} alt="" />
              <i className="fa fa-check"></i>
            </Link>
          )}
        </div>
        <div className="author_list_info">
          {loading ? (
            <Skeleton width="125px" height="20px" />
          ) : (
            <Link to={`/author/${authorId}`}>{name}</Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemAuthor;
