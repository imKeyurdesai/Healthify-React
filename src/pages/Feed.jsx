import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Alert } from "../components/";
import { Like, Dislike } from "../assets";
import { FaRegCommentDots } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function Feed() {
  const userdata = useSelector((state) => state.user?.userdata ?? {});
  const currentUserId = userdata?._id || userdata?.id || "";
  const role = userdata?.role || "patient";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingPostId, setEditingPostId] = useState("");
  const [openMenuPostId, setOpenMenuPostId] = useState("");
  const [openCommentPostId, setOpenCommentPostId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentsByPostId, setCommentsByPostId] = useState({});
  const [commentLoadingByPostId, setCommentLoadingByPostId] = useState({});
  const [actionLoadingPostId, setActionLoadingPostId] = useState("");

  const [feed, setFeed] = useState([]);

  const showAlert = ({
    type = "info",
    title = "Notice",
    message = "",
    timeout = 4000,
  }) => {
    setAlertData({
      id: Date.now(),
      type,
      title,
      message,
      timeout,
    });
  };

  const normalizeFeedPayload = (payload) => {
    if (Array.isArray(payload?.posts)) return payload.posts;
    return [];
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: null,
    });
  };

  const toFormData = (payload) => {
    const body = new FormData();
    if (payload.title) body.append("title", payload.title);
    if (payload.content) body.append("content", payload.content);
    if (payload.image) body.append("image", payload.image);
    return body;
  };

  const getPostId = (post) => post?._id || post?.id;

  const getAuthorId = (post) => {
    if (!post?.authorId) return "";
    if (typeof post.authorId === "string") return post.authorId;
    return post.authorId?._id || post.authorId?.id || "";
  };

  const getPostLikes = (post) => (Array.isArray(post?.likes) ? post.likes : []);

  const hasUserLikedPost = (post) => {
    return getPostLikes(post).some((like) => {
      if (typeof like === "string") return like === currentUserId;
      const liker =
        like?.userId ?? like?.user ?? like?.authorId ?? like?.profile;
      if (!liker) return false;
      if (typeof liker === "string") return liker === currentUserId;
      return liker?._id === currentUserId || liker?.id === currentUserId;
    });
  };

  const getPostLikeCount = (post) => getPostLikes(post).length;

  const getPostCommentCount = (post) => {
    const postId = getPostId(post);
    const loadedComments = getPostComments(postId);
    if (loadedComments.length > 0) return loadedComments.length;
    if (typeof post?.commentsCount === "number") return post.commentsCount;
    return 0;
  };

  const getCommentId = (comment) => comment?._id || comment?.id;

  const getCommentAuthor = (comment) => comment?.user || null;

  const getCommentAuthorId = (comment) => {
    const author = getCommentAuthor(comment);
    if (!author) return "";
    if (typeof author === "string") return author;
    return author?._id || author?.id || "";
  };

  const getCommentAuthorName = (comment) => {
    const author = getCommentAuthor(comment);
    if (!author) return "Anonymous";
    if (typeof author === "string") return "Anonymous";
    return (
      [author?.firstName, author?.lastName].filter(Boolean).join(" ") ||
      author?.name ||
      "Anonymous"
    );
  };

  const getCommentAutherRole = (comment) => {
    const author = getCommentAuthor(comment);
    if (!author) return "Anonymous";
    if (typeof author === "string") return "Anonymous";
    return author?.role || "patient";
  };

  const getCommentText = (comment) =>
    comment?.text || comment?.content || comment?.message || "";

  const getPostComments = (postId) => commentsByPostId[postId] ?? [];

  const isOwnPost = useCallback(
    (post) => Boolean(getAuthorId(post) && getAuthorId(post) === currentUserId),
    [currentUserId],
  );

  const canManagePosts = role === "doctor";

  const handlePostUpload = async () => {
    if (!canManagePosts) {
      showAlert({
        type: "error",
        title: "Unauthorized",
        message: "Only doctors can create posts.",
      });
      return;
    }

    if (!formData.title?.trim() || !formData.content?.trim()) {
      showAlert({
        type: "warning",
        title: "Missing fields",
        message: "Please enter both a title and content before uploading.",
      });
      return;
    }

    setLoading(true);
    try {
      const body = toFormData(formData);
      await axios.post(
        import.meta.env.VITE_SERVER_URL + `/feed/post/upload`,
        body,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      showAlert({
        type: "success",
        title: "post uploaded",
        message: "your post uploaded successfully",
      });
      resetForm();
      setShowCreatePopup(false);
      await fetchFeed();
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to upload",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = async (post) => {
    const id = getPostId(post);
    if (!id) return;

    if (!isOwnPost(post)) {
      showAlert({
        type: "error",
        title: "Unauthorized",
        message: "You can delete only your own posts.",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        import.meta.env.VITE_SERVER_URL + `/feed/post/delete/${id}`,
        {
          withCredentials: true,
        },
      );
      showAlert({
        type: "success",
        title: "post deleted",
        message: "your post has been deleted successfully",
      });
      setOpenMenuPostId("");
      await fetchFeed();
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to delete",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = async (id, currentPost = {}) => {
    if (!id) return;

    setLoading(true);
    try {
      const body = toFormData({
        title: formData.title || currentPost.title,
        content: formData.content || currentPost.content,
        image: formData.image,
      });

      await axios.put(
        import.meta.env.VITE_SERVER_URL + `/feed/post/update/${id}`,
        body,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      showAlert({
        type: "success",
        title: "post updated",
        message: "your post has been updated successfully",
      });
      resetForm();
      setShowEditPopup(false);
      setEditingPostId("");
      setOpenMenuPostId("");
      await fetchFeed();
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to update",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_SERVER_URL + `/feed`, {
        withCredentials: true,
      });
      const payload = res?.data?.body ?? res?.data;
      setFeed(normalizeFeedPayload(payload));
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to fetch feed",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommentsForPost = useCallback(async (postId) => {
    if (!postId) return;

    setCommentLoadingByPostId((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/feed/posts/${postId}/comments`,
        {
          withCredentials: true,
        },
      );
      const payload = res?.data?.body ?? res?.data;
      const comments = Array.isArray(payload?.comments)
        ? payload.comments
        : Array.isArray(payload)
          ? payload
          : [];

      setCommentsByPostId((prev) => ({
        ...prev,
        [postId]: comments,
      }));
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to fetch comments",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setCommentLoadingByPostId((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  }, []);

  const updateFeedPost = (postId, updater) => {
    setFeed((prevFeed) =>
      prevFeed.map((post) => {
        if (getPostId(post) !== postId) return post;
        return updater(post);
      }),
    );
  };

  const handleLikeToggle = async (post) => {
    const postId = getPostId(post);
    if (!postId) return;

    const previousPost =
      feed.find((item) => getPostId(item) === postId) || post;

    updateFeedPost(postId, (currentPost) => {
      const likes = getPostLikes(currentPost);
      const hasLiked = likes.some((like) => {
        if (typeof like === "string") return like === currentUserId;
        const liker =
          like?.userId ?? like?.user ?? like?.authorId ?? like?.profile;
        if (!liker) return false;
        if (typeof liker === "string") return liker === currentUserId;
        return liker?._id === currentUserId || liker?.id === currentUserId;
      });

      return {
        ...currentPost,
        likes: hasLiked
          ? likes.filter((like) => {
              if (typeof like === "string") return like !== currentUserId;
              const liker =
                like?.userId ?? like?.user ?? like?.authorId ?? like?.profile;
              if (!liker) return true;
              if (typeof liker === "string") return liker !== currentUserId;
              return (
                liker?._id !== currentUserId && liker?.id !== currentUserId
              );
            })
          : [...likes, currentUserId],
      };
    });

    setActionLoadingPostId(postId);
    try {
      const res = await axios.patch(
        import.meta.env.VITE_SERVER_URL + `/feed/post/${postId}/like`,
        {},
        {
          withCredentials: true,
        },
      );

      const responsePost =
        res?.data?.body?.post ?? res?.data?.post ?? res?.data?.body ?? null;

      if (responsePost && getPostId(responsePost) === postId) {
        updateFeedPost(postId, () => responsePost);
        return;
      }
    } catch (error) {
      updateFeedPost(postId, () => previousPost);
      showAlert({
        type: "error",
        title: "unable to update like",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setActionLoadingPostId("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handlePostUpload();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editingPost = useMemo(() => {
    return feed.find((post) => getPostId(post) === editingPostId) || null;
  }, [feed, editingPostId]);

  const openCreateModal = () => {
    resetForm();
    setShowCreatePopup(true);
  };

  const openEditModal = (post) => {
    if (!isOwnPost(post)) {
      showAlert({
        type: "error",
        title: "Unauthorized",
        message: "You can edit only your own posts.",
      });
      return;
    }

    setEditingPostId(getPostId(post));
    setFormData({
      title: post?.title || "",
      content: post?.content || "",
      image: null,
    });
    setShowEditPopup(true);
    setOpenMenuPostId("");
  };

  const closeModal = () => {
    resetForm();
    setShowCreatePopup(false);
    setShowEditPopup(false);
    setEditingPostId("");
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    await handlePostUpdate(editingPostId, editingPost || {});
  };

  const formatDate = (date) => {
    if (!date) return "";
    const value = new Date(date);
    if (Number.isNaN(value.getTime())) return "";
    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleCommentBox = (post) => {
    const postId = getPostId(post);
    const nextPostId = openCommentPostId === postId ? "" : postId;
    setOpenCommentPostId(nextPostId);
    setCommentText("");
    if (nextPostId) {
      void fetchCommentsForPost(nextPostId);
    }
  };

  const handleCommentSubmit = async (event, postId) => {
    event.preventDefault();
    if (!commentText.trim()) {
      showAlert({
        type: "warning",
        title: "Empty comment",
        message: "Please write a comment before posting it.",
      });
      return;
    }

    try {
      setActionLoadingPostId(postId);
      await axios.post(
        import.meta.env.VITE_SERVER_URL + `/feed/post/${postId}/comment`,
        {
          text: commentText,
        },
        { withCredentials: true },
      );

      showAlert({
        type: "success",
        title: "comment added",
        message: "Your comment was posted successfully.",
        timeout: 2500,
      });
      setCommentText("");
      await fetchCommentsForPost(postId);
      await fetchFeed();
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to comment",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setActionLoadingPostId("");
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    if (!postId || !commentId) return;

    try {
      setActionLoadingPostId(postId);
      await axios.delete(
        import.meta.env.VITE_SERVER_URL +
          `/feed/posts/${postId}/comments/${commentId}`,
        {
          withCredentials: true,
        },
      );
      showAlert({
        type: "success",
        title: "comment deleted",
        message: "Your comment was removed successfully.",
        timeout: 2500,
      });
      await fetchCommentsForPost(postId);
      await fetchFeed();
    } catch (error) {
      showAlert({
        type: "error",
        title: "unable to delete comment",
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setActionLoadingPostId("");
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-3 py-6 sm:px-4">
      <h1 className="border-b border-amber-200 py-4 text-center text-2xl font-semibold">
        Feed
      </h1>

      {alertData ? <Alert key={alertData.id} {...alertData} /> : null}

      {canManagePosts ? (
        <div className="z-20 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 cursor-pointer"
            onClick={openCreateModal}
            disabled={loading}
          >
            Add Post +
          </button>
        </div>
      ) : null}

      {!loading ? (
        <div className="grid gap-5">
          {Array.isArray(feed) && feed.length > 0 ? (
            feed.map((post) => (
              <article
                key={getPostId(post)}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-4xl border-2 border-cyan-300 overflow-clip">
                      <img
                        src={post.authorId.profileUrl}
                        alt="profile"
                        className="object-contain"
                      />
                    </div>
                    <p className=" font-semibold text-slate-900">
                      {(post.authorId.firstName || "anoynomus") +
                        " " +
                        (post.authorId?.lastName || "")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(post?.createdAt) || "Recently posted"}
                    </p>
                  </div>

                  {canManagePosts && isOwnPost(post) ? (
                    <div className="relative">
                      <button
                        type="button"
                        className="rounded-lg px-2 py-1 text-xl leading-none text-slate-600 hover:bg-slate-100 cursor-pointer"
                        onClick={() =>
                          setOpenMenuPostId((prev) =>
                            prev === getPostId(post) ? "" : getPostId(post),
                          )
                        }
                      >
                        ...
                      </button>
                      {openMenuPostId === getPostId(post) ? (
                        <div className="absolute right-0 top-9 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 cursor-pointer"
                            onClick={() => openEditModal(post)}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50 cursor-pointer"
                            onClick={() => handlePostDelete(post)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="px-3 my-1">
                  <div className=" pb-3">
                    <h2 className="text-3xl font-semibold text-slate-900">
                      {post?.title ?? "Untitled"}
                    </h2>
                  </div>
                  <div>
                    {post?.imageUrl ? (
                      <div className="flex p-2 ">
                        <img
                          src={post.imageUrl}
                          alt={post?.title || "Post image"}
                          className="aspect-square max-h-80 w-full object-contain bg-slate-200"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full bg-linear-to-br from-slate-100 to-slate-200" />
                    )}
                  </div>

                  <div className="px-4 py-3">
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {post?.content ?? ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-5 border-y-2 border-slate-200 px-4 py-2.5">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="flex max-h-70 cursor-pointer items-center justify-center rounded-2xl p-2 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleLikeToggle(post)}
                        disabled={actionLoadingPostId === getPostId(post)}
                      >
                        {hasUserLikedPost(post) ? (
                          <Like className="h-8 w-8" />
                        ) : (
                          <Dislike className="h-8 w-8" />
                        )}
                      </button>
                      <span className="text-sm font-semibold text-slate-700">
                        {getPostLikeCount(post)} Likes
                      </span>
                    </div>

                    <button
                      className={`flex items-center mx-1 px-2 rounded-3xl hover:bg-slate-100 ${openCommentPostId === getPostId(post) ? "bg-slate-200 " : ""}  cursor-pointer`}
                      type="button"
                      onClick={() => toggleCommentBox(post)}
                      disabled={actionLoadingPostId === getPostId(post)}
                    >
                      <div className="rounded-full px-2 py-1.5 text-xs font-semibold  text-slate-700 transition ">
                        <FaRegCommentDots className="h-8 w-8" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {getPostCommentCount(post)} Comments
                      </span>
                    </button>
                  </div>

                  {openCommentPostId === getPostId(post) ? (
                    <form
                      className="border-t border-slate-100 px-4 py-4"
                      onSubmit={(event) =>
                        handleCommentSubmit(event, getPostId(post))
                      }
                    >
                      <label
                        htmlFor={`comment-${getPostId(post)}`}
                        className="mb-2 block text-sm font-semibold text-slate-900"
                      >
                        Write a comment
                      </label>
                      <textarea
                        id={`comment-${getPostId(post)}`}
                        className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
                        placeholder="Share your thoughts..."
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                      />
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            setOpenCommentPostId("");
                            setCommentText("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                          disabled={actionLoadingPostId === getPostId(post)}
                        >
                          {actionLoadingPostId === getPostId(post)
                            ? "Working..."
                            : "Post Comment"}
                        </button>
                      </div>
                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                        <p className="text-sm font-semibold text-slate-900">
                          Comments ({getPostCommentCount(post)})
                        </p>

                        <section className="flex p-3 px-2 flex-col gap-2 overflow-auto max-h-150">
                          {commentLoadingByPostId[getPostId(post)] ? (
                            <p className="text-sm text-slate-500">
                              Loading comments...
                            </p>
                          ) : getPostComments(getPostId(post)).length > 0 ? (
                            getPostComments(getPostId(post)).map((comment) => {
                              const commentId = getCommentId(comment);
                              const commentAuthorId =
                                getCommentAuthorId(comment);
                              const canDeleteComment =
                                commentAuthorId &&
                                commentAuthorId === currentUserId;
                              const isPostAuthor = commentAuthorId === post.authorId._id;

                              return (
                                <div
                                  key={commentId}
                                  className={`rounded-xl border border-slate-200 p-3 ${getCommentAutherRole(comment) === "doctor" ? "bg-orange-100" : ""} `}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="flex items-center">
                                        <p className="font-semibold text-slate-900">
                                          {getCommentAuthorName(comment)}
                                        </p>
                                        <p className="text-xs text-slate-700 px-2">
                                          {isPostAuthor ? "(author)" : ""}
                                        </p>
                                      </div>
                                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                        {getCommentText(comment) ||
                                          "No comment text"}
                                      </p>
                                    </div>

                                    {canDeleteComment ? (
                                      <button
                                        type="button"
                                        className="rounded-lg px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                                        onClick={() =>
                                          handleCommentDelete(
                                            getPostId(post),
                                            commentId,
                                          )
                                        }
                                        disabled={
                                          actionLoadingPostId ===
                                          getPostId(post)
                                        }
                                      >
                                        <MdDelete className="h-5 w-5 cursor-pointer" />
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-slate-500">
                              No comments yet.
                            </p>
                          )}
                        </section>
                      </div>
                    </form>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500">
              {loading ? "Loading feed..." : "No posts yet."}
            </p>
          )}
        </div>
      ) : (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-start gap-5 border-b border-slate-100 px-4 py-3">
            <div className="h-12 w-12 rounded-4xl bg-slate-400"></div>
            <div className="rounded bg-slate-500 h-5 w-30 animate-pulse"></div>
          </div>

          <div>
            <div className="aspect-square px-4 mx-auto h-50 w-9/12 bg-linear-to-br from-slate-100 to-slate-200" />

            <div className="px-4 py-3">
              <h2 className="rounded bg-slate-500 px-4 h-18 w-full animate-pulse"></h2>
            </div>

            <div className="flex items-center gap-5 border-y-2 border-slate-200 px-4 py-2.5">
              <button
                type="button"
                className="flex max-h-70 cursor-pointer items-center justify-center rounded-2xl p-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Dislike className="h-8 w-8 animate-pulse" />
              </button>
              <span className="text-sm font-semibold text-slate-700 animate-pulse">
                likes
              </span>

              <button
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50`}
              >
                <FaRegCommentDots className="h-8 w-8 animate-pulse" />
              </button>
              <span className="text-sm font-semibold text-slate-700 animate-pulse">
                comments
              </span>
            </div>
          </div>
        </article>
      )}

      {showCreatePopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create new post</h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                onClick={closeModal}
              >
                X
              </button>
            </div>

            <form
              action=""
              method="post"
              encType="multipart/form-data"
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
                type="text"
                name="title"
                id="create-title"
                placeholder="Post title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <textarea
                className="min-h-32 rounded-xl border border-slate-300 px-4 py-3"
                name="content"
                id="create-content"
                placeholder="Write your post..."
                value={formData.content}
                onChange={handleInputChange}
              />
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                type="file"
                name="image"
                id="create-image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                className="rounded-xl bg-amber-200 px-4 py-2 font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? "Working..." : "Publish Post"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {showEditPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Update post</h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100 cursor-pointer"
                onClick={closeModal}
              >
                X
              </button>
            </div>

            <form
              action=""
              method="post"
              encType="multipart/form-data"
              className="flex flex-col gap-4"
              onSubmit={handleEditSubmit}
            >
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
                type="text"
                name="title"
                id="edit-title"
                placeholder="Post title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <textarea
                className="min-h-32 rounded-xl border border-slate-300 px-4 py-3"
                name="content"
                id="edit-content"
                placeholder="Write your post..."
                value={formData.content}
                onChange={handleInputChange}
              />
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                type="file"
                name="image"
                id="edit-image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? "Working..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Feed;
