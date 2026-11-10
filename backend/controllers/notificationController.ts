import type { Request, Response } from "express";
import NotificationModel from "../models/Notification.js";

export const getMyNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.authUser?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const notifications = await NotificationModel.find({
      recipient: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.authUser?.userId;
    const { id } = req.params;

    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: id,
        recipient: userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};