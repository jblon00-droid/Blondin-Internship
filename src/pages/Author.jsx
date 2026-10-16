import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { useParams } from "react-router-dom";
import axios from "axios";
import Skeleton from "../components/UI/Skeleton";

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAuthor(null);
    setIsFollowing(false);
    async function fetchAuthor() {
      try {
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthor(data);
      } catch (error) {
        console.error("Failed to fetch author:", error);
      }
    }
    fetchAuthor();
  }, [authorId]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(author.address);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy wallet address:", error);
    }
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              {/* Remounts when the author loads so the animation plays on the real data. */}
              <div
                className="col-md-12"
                key={author ? "profile-loaded" : "profile-loading"}
                data-aos={author ? "fade-up" : undefined}
              >
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {author ? (
                        <img src={author.authorImage} alt="" />
                      ) : (
                        <Skeleton
                          width="150px"
                          height="150px"
                          borderRadius="50%"
                        />
                      )}

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        {author ? (
                          <h4>
                            {author.authorName}
                            <span className="profile_username">
                              @{author.tag}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button
                              id="btn_copy"
                              title="Copy Text"
                              className={copied ? "clicked" : ""}
                              onClick={handleCopy}
                            >
                              {copied ? "Copied!" : "Copy"}
                            </button>
                          </h4>
                        ) : (
                          <h4>
                            <Skeleton width="200px" height="24px" />
                            <span className="profile_username">
                              <Skeleton width="100px" height="16px" />
                            </span>
                            <span className="profile_wallet">
                              <Skeleton width="250px" height="16px" />
                            </span>
                          </h4>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {author ? (
                          `${
                            author.followers + (isFollowing ? 1 : 0)
                          } followers`
                        ) : (
                          <Skeleton width="150px" height="40px" />
                        )}
                      </div>
                      <button
                        className="btn-main"
                        disabled={!author}
                        onClick={() => setIsFollowing(!isFollowing)}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems
                    items={author?.nftCollection}
                    authorId={author?.authorId}
                    authorImage={author?.authorImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
