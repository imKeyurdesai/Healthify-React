import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Alert } from "../components/";
import { Like, Dislike } from "../assets";
import { FaRegCommentDots } from "react-icons/fa6";

function Feed() {
  const userdata = useSelector((state) => state.user?.userdata ?? {});
  const currentUserId = userdata?._id || userdata?.id || "";
  const role = userdata?.role || "patient";

  const [liked, setliked] = useState(false);

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

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

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

  const handleComingSoonAction = (actionLabel) => {
    showAlert({
      type: "info",
      title: `${actionLabel} coming soon`,
      message: `${actionLabel} will be available in an upcoming update.`,
      timeout: 2500,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-3 py-6 sm:px-4">
      <h1 className="border-b border-amber-200 py-4 text-center text-2xl font-semibold">
        Feed
      </h1>

      {alertData ? <Alert key={alertData.id} {...alertData} /> : null}

      {canManagePosts ? (
        <div className="sticky top-22 z-20 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
            onClick={openCreateModal}
            disabled={loading}
          >
            Add Post +
          </button>
        </div>
      ) : null}

      <div className="grid gap-5">
        {Array.isArray(feed) && feed.length > 0 ? (
          feed.map((post) => (
            <article
              key={getPostId(post)}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Doctor</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(post?.createdAt) || "Recently posted"}
                  </p>
                </div>

                {canManagePosts && isOwnPost(post) ? (
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-xl leading-none text-slate-600 hover:bg-slate-100"
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
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                          onClick={() => openEditModal(post)}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                          onClick={() => handlePostDelete(post)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div>
                {post?.imageUrl ? (
                  <div className="flex p-2 ">
                    <img
                      src={post.imageUrl}
                      alt={post?.title || "Post image"}
                      className="aspect-square max-h-80 w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-linear-to-br from-slate-100 to-slate-200" />
                )}

                <div className="px-4 py-3">
                  <h2 className="text-base font-semibold text-slate-900">
                    {post?.title ?? "Untitled"}
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {post?.content ?? ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 border-y-2 border-slate-200 px-4 py-2.5">
                  <button
                    type="buttom"
                    className="cursor-pointer rounded-2xl p-2 max-h-70 flex justify-center items-center"
                    onClick={() => setliked(!liked)}
                  >
                    {liked ? (
                      <Like className="w-8 h-8" />
                    ) : (
                      <Dislike className="w-8 h-8" />
                    )}
                  </button>

                  <button
                    type="button"
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => handleComingSoonAction("Comment")}
                  >
                  <FaRegCommentDots className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-center text-sm text-slate-500">
            {loading ? "Loading feed..." : "No posts yet."}
          </p>
        )}
      </div>

      {showCreatePopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create new post</h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
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
                className="rounded-xl bg-amber-200 px-4 py-2 font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100"
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
                className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
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
