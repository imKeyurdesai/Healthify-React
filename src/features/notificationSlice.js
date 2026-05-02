import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: []
}

const normalizeNotification = (notification) => ({
    notificationId: notification?._id,
    title: notification?.title,
    message: notification?.message,
    isRead: notification?.isRead,
    createdAt: notification?.createdAt,
});

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            const notifications = Array.isArray(action.payload) ? action.payload : [action.payload];
            const normalizedNotification = notifications.map((notification) => normalizeNotification(notification));
            state.notifications.push(...normalizedNotification);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        markAsRead : (state, action) => {
            const notificationId = action.payload;
            state.notifications = state.notifications.find((notification) => notification.notificationId === notificationId).isRead = true;
        },
        markAllRead : (state) => {
            state.notifications = state.notifications.map((notification) => ({ ...notification, isRead: true }));
        }
    }
});

export const { addNotification, clearNotifications, markAsRead, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;