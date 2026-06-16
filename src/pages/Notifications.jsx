import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsRead,
  markAllRead,
  clearNotifications,
  addNotification,
} from "../features/notificationSlice";
import axios from "axios";
import { Alert } from "../components";

function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((s) => s.notifications.notifications || []);
  const [alertData, setAlertData] = useState(null);

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

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/user/notification/view",
        {
          withCredentials: true,
        },
      );
      dispatch(addNotification(res.data.body));
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message: "Failed to fetch notifications." + error.message,
        timeout: 4000,
      });
    }
  };

  const handleMark = async (id) => {
    try {
      await axios.patch(
        import.meta.env.VITE_SERVER_URL + `/user/notification/mark-read/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(markAsRead(id));
      showAlert({
        type: "success",
        title: "Success",
        message: "Notification marked as read.",
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message: "Failed to mark notification as read." + error.message,
        timeout: 4000,
      });
    }
  };

  const handleMarkAll = async () => {
    try {
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      if (unreadCount === 0) {
        throw new Error("All notifications are already marked as read");
      }

      await axios.patch(
        import.meta.env.VITE_SERVER_URL + "/user/notification/mark-all-read",
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(markAllRead());
      showAlert({
        type: "success",
        title: "Success",
        message: "All notifications marked as read.",
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to mark all notifications as read.",
        timeout: 4000,
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex gap-2">
          {alertData && (
            <div className="absolute top-4 left-1/2 z-50 w-full -translate-x-1/2 px-4 sm:w-auto">
              <Alert
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                timeout={4000}
              />
            </div>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAll}
              className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-3 overflow-auto h-[70vh] p-2">
        {notifications.length === 0 && (
          <li className="text-gray-500">No notifications</li>
        )}

        {Array.isArray(notifications) &&
          notifications.map((n) => (
            <li
              key={n.notificationId}
              className={`p-4 border rounded ${n.isRead ? "bg-white" : "bg-blue-50"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{n.title || "Notification"}</div>
                  <div className="text-sm text-gray-700">{n.message}</div>
                  {n.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      {String(n.createdAt)}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMark(n.notificationId)}
                      className="px-2 py-1 text-sm bg-green-500 text-white rounded cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Notifications;
