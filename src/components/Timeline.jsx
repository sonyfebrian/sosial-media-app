import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "./LoadingSpinner";
import Swal from "sweetalert2";

const Timeline = () => {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentFormVisible, setCommentFormVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);
  const [postId, setPostId] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [singleUser, setSingleUser] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPostsAndUsers = async () => {
    try {
      const postsResponse = await axios.get(
        `https://dummyjson.com/posts?limit=10&page=${page}`
      );
      const usersResponse = await axios.get("https://dummyjson.com/users");
      const commentsResponse = await axios.get(
        "https://dummyjson.com/comments"
      );

      const userID = await axios.get("https://dummyjson.com/users/1");

      const postsData = postsResponse.data.posts;
      const usersData = usersResponse.data.users;
      const commentsData = commentsResponse.data.comments;
      const singleUser = userID.data.id;

      const matchedPosts = postsData?.map((post) => {
        const user = usersData.find((user) => user.id === post.userId);
        return { ...post, user };
      });

      setPosts((prevPosts) => [...prevPosts, ...matchedPosts]);
      setSingleUser(singleUser);

      setPage((prevPage) => prevPage + 1);
      setHasMore(matchedPosts.length > 0);

      setComments(commentsData);
      setPostId(commentsData.postId);
      setUserId(commentsData.user?.id);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "request limit exceeded, please try again in 1 mint",
      });

      if (error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
      } else {
        throw error;
      }
    }
  };
  useEffect(() => {
    fetchPostsAndUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleShowComments = (commentId, postId) => {
    setShowComments(!showComments);
    setUserId(commentId);
    setPostId(postId);
  };

  const handleAddComment = () => {
    setCommentFormVisible(true);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setNewComment(value);
      setError("");
    } else {
      setError("Title must be within 100 characters.");
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://dummyjson.com/comments/add", {
        body: newComment,
        postId: postId,
        userId: userId,
      });

      const newCommentData = response.data;

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
      setCommentFormVisible(false);
      console.error("sukses");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const handlePostTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setPostTitle(value);
      setError("");
    } else {
      setError("Title must be within 100 characters.");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://dummyjson.com/posts/add", {
        title: postTitle,
        userId: singleUser,
      });

      const newPostData = response.data;

      if (Array.isArray(newPostData)) {
        setPosts((prevPosts) => [...prevPosts, ...newPostData]);
      } else {
        setPosts((prevPosts) => [...prevPosts, newPostData]);
      }
      Swal.fire({
        icon: "success",
        title: "Success",
      });
      setPostTitle("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "request limit exceeded, please try again in 1 mint",
      });

      if (error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <div className="flex rounded-lg h-full border-gray-200 border p-4 mb-8 w-full flex-col">
        {" "}
        <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
          <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10"
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
            <textarea
              className="grow p-3 h-14 w-full border-gray-200 border rounded-xl"
              placeholder={`Whats on your mind`}
              value={postTitle}
              onChange={handlePostTitleChange}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div className="grow text-right">
          <button
            className="bg-blue-500 text-white px-6 py-1 rounded-md"
            onClick={handlePostSubmit}
          >
            Share
          </button>
        </div>
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPostsAndUsers}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {posts?.map((post) => {
          const postComments = comments.filter(
            (comment) => comment.postId === post.id
          );

          return (
            <>
              {" "}
              <div
                className="flex rounded-lg h-full border-gray-200 border p-8 flex-col"
                key={post.id}
              >
                <div className="flex items-center mb-3">
                  <img
                    src={post.user?.image}
                    alt=""
                    className="w-12 h-12 mr-1 inline-flex items-center justify-center rounded-full bg-indigo-100 text-white flex-shrink-0"
                  />
                  <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                    <h2 className="font-medium title-font text-gray-900 mb-1 text-xl">
                      {post.user?.firstName && post.user?.lastName
                        ? `${post.user?.firstName} ${post.user?.lastName}`
                        : "Anonymous"}
                    </h2>
                    <p className="leading-relaxed">
                      {post.user?.company.department
                        ? post.user?.company.department
                        : "Anonymous"}
                    </p>
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">{post.body}</p>
                  <div className="mt-5 flex gap-8">
                    <button className="flex gap-2 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 ${
                          post.reactions ? "fill-red-500" : "none"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                      {post.reactions}
                    </button>
                    <button
                      className="flex gap-2 items-center"
                      onClick={() => handleShowComments(post.userId, post.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>
                      {postComments.length}
                    </button>
                  </div>
                  {showComments && (
                    <div className="flex mt-3 rounded-lg h-full border-gray-200 border p-8 flex-col">
                      {postComments.map((comment) => (
                        <>
                          <div
                            className="flex items-center mb-3"
                            key={comment.id}
                          >
                            <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                              <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>

                            <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                              <h2 className="font-medium title-font text-gray-900 mb-1 text-xl">
                                {comment.user.username
                                  ? comment.user.username
                                  : "Anonymous"}
                              </h2>
                              <p className="leading-relaxed">{comment.body}</p>
                            </div>
                          </div>
                        </>
                      ))}
                      {!commentFormVisible && (
                        <button
                          onClick={handleAddComment}
                          className="mt-3 text-indigo-500 inline-flex items-center"
                        >
                          Add Comment
                        </button>
                      )}
                      {commentFormVisible && (
                        <form onSubmit={handleSubmitComment}>
                          <div className="border grow rounded-full relative">
                            {" "}
                            <input
                              type="text"
                              value={newComment}
                              onChange={handleCommentChange}
                              placeholder="Enter your comment..."
                              className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full"
                            />
                            <button
                              type="submit"
                              className="absolute top-3 right-3 text-gray-400"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </InfiniteScroll>
    </>
  );
};

export default Timeline;
