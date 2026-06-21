const Notification = require("../Models/Notification");

const notificationService = {
    init: (socketIoInstance) => {
        io = socketIoInstance;
    },
    notifyUser: async (userId, type, title, body, relatedId = null) => {
        try {
            const notification = await Notification.create({
                userId,
                type,
                title,
                body,
                relatedId
            });

            if(io){
                io.to(`user:${userId}`).emit("new_notification", notification);
                console.log(`Live notification sent to user: ${userId}`);
            }

            return notification;
        } catch(error) {
            console.error("Error sending notification: ", error);
        }
    }
};

module.exports = notificationService;