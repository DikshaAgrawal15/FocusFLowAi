export function getReminderPlan(deadline) {
  const now = new Date();
  const due = new Date(deadline);

  const diffHours = Math.floor((due - now) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours <= 1) {
    return {
      channel: "🚨 Full Screen Alert",
      frequency: "Every 10 minutes",
      level: "Critical",
      color: "text-red-500",
    };
  }

  if (diffHours <= 6) {
    return {
      channel: "💬 WhatsApp",
      frequency: "Every 30 minutes",
      level: "Very High",
      color: "text-orange-400",
    };
  }

  if (diffDays <= 1) {
    return {
      channel: "📸 Instagram Overlay",
      frequency: "Every Hour",
      level: "High",
      color: "text-pink-400",
    };
  }

  if (diffDays <= 3) {
    return {
      channel: "📱 Push Notification",
      frequency: "Twice Daily",
      level: "Medium",
      color: "text-cyan-400",
    };
  }

  return {
    channel: "📧 Email",
    frequency: "Once Daily",
    level: "Low",
    color: "text-green-400",
  };
}
