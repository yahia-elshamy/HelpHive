const User = require("../Models/User");
const Badge = require("../Models/Badge");
const notificationService = require("./notificationService");

const evaluateBadges = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user) return;

        const {tasksCompleted, honeyCollected} = user;

        let newBadges = [];

        const thresholds = [
            { key: "early_bird", criteria: tasksCompleted >= 1, icon: "🐣", title: "Early Bird" },
            { key: "seed_planter", criteria: tasksCompleted >= 5, icon: "🌱", title: "Seed Planter" },
            { key: "top_helper", criteria: tasksCompleted >= 100, icon: "🏆", title: "Top Helper" },
            { key: "gold_tier", criteria: honeyCollected >= 500, icon: "💰", title: "Gold Tier" }
        ];

        for (const threshold of thresholds) {
            if(threshold.criteria) {
                const alreadyHasBadge = await Badge.findOne({userId, badgeKey: threshold.key});

                if(!alreadyHasBadge) {
                    const badge = await Badge.create({
                        userId,
                        badgeKey: threshold.key,
                        awardedAt: new Date()
                    });

                    await notificationService.notifyUser(
                        userId,
                        "badge_unlocked",
                        "New Achievement! 🎖️",
                        `You've earned the ${threshold.title} badge! ${threshold.icon}`,
                        badge._id
                    );
                }
            }
        }

    } catch(error) {
        console.error("Badge Engine error: ", error);
    }
};

module.exports = {evaluateBadges};