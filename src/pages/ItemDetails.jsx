import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Skeleton from "../components/UI/Skeleton";
import ItemAuthor from "../components/itemDetails/ItemAuthor";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [item, setItem] = useState(null);
  // "loading" | "loaded" | "notFound" | "error"
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    // Ignore a slower, older response if the user moves to another NFT.
    let ignore = false;

    window.scrollTo(0, 0);
    setItem(null);
    setStatus("loading");

    async function fetchItem() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails",
          { params: { nftId } }
        );
        if (ignore) return;
        // The API returns an empty response for an unknown nftId.
        if (data && data.nftId) {
          setItem(data);
          setStatus("loaded");
        } else {
          setStatus("notFound");
        }
      } catch (error) {
        console.error("Failed to fetch item details:", error);
        if (!ignore) setStatus("error");
      }
    }
    fetchItem();

    return () => {
      ignore = true;
    };
  }, [nftId]);

  const loading = status === "loading";

  if (status === "notFound" || status === "error") {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container text-center">
              <h2>
                {status === "notFound"
                  ? "This NFT could not be found."
                  : "Something went wrong loading this NFT."}
              </h2>
              <Link to="/explore" className="btn-main">
                Back to Explore
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                {loading ? (
                  <Skeleton width="100%" height="500px" borderRadius="8px" />
                ) : (
                  <img
                    src={item.nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt=""
                  />
                )}
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  {loading ? (
                    <Skeleton width="300px" height="40px" />
                  ) : (
                    <h2>
                      {item.title} #{item.tag}
                    </h2>
                  )}

                  <div className="item_info_counts">
                    {loading ? (
                      <>
                        <Skeleton width="80px" height="30px" />
                        <Skeleton width="80px" height="30px" />
                      </>
                    ) : (
                      <>
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i>
                          {item.views}
                        </div>
                        <div className="item_info_like">
                          <i className="fa fa-heart"></i>
                          {item.likes}
                        </div>
                      </>
                    )}
                  </div>
                  {loading ? (
                    <Skeleton width="100%" height="80px" />
                  ) : (
                    <p>{item.description}</p>
                  )}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <ItemAuthor
                        label="Owner"
                        loading={loading}
                        authorId={item?.ownerId}
                        name={item?.ownerName}
                        image={item?.ownerImage}
                      />
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <ItemAuthor
                        label="Creator"
                        loading={loading}
                        authorId={item?.creatorId}
                        name={item?.creatorName}
                        image={item?.creatorImage}
                      />
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    {loading ? (
                      <Skeleton width="75px" height="20px" />
                    ) : (
                      <div className="nft-item-price">
                        <img src={EthImage} alt="" />
                        <span>{item.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
