export function calculateDecision(priority, deadline, category, screenTime) {
  let score = 0;

  // ---------------------
  // Deadline Weight (40)
  // ---------------------

  const today = new Date();

  const due = new Date(deadline);

  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff <= 1) score += 40;
  else if (diff <= 3) score += 30;
  else if (diff <= 7) score += 20;
  else score += 10;

  // ---------------------
  // Screen Time (30)
  // ---------------------

  if (screenTime >= 240) score += 30;
  else if (screenTime >= 180) score += 20;
  else if (screenTime >= 120) score += 15;
  else score += 5;

  // ---------------------
  // Priority (20)
  // ---------------------

  if (priority === "High") score += 20;
  else if (priority === "Medium") score += 12;
  else score += 5;

  // ---------------------
  // Category (10)
  // ---------------------

  if (category === "Interview") score += 10;
  else if (category === "Assignment") score += 8;
  else if (category === "Meeting") score += 6;
  else if (category === "Bill Payment") score += 5;
  else score += 3;

  // ---------------------
  // Decision
  // ---------------------

  let channel = "";
  let reminder = "";
  let escalation = "";

  if (score >= 85) {
    channel = "Instagram Overlay";

    reminder = "Every 30 Minutes";

    escalation = "Critical";
  } else if (score >= 70) {
    channel = "WhatsApp";

    reminder = "Every 2 Hours";

    escalation = "High";
  } else if (score >= 50) {
    channel = "Push Notification";

    reminder = "Twice Daily";

    escalation = "Medium";
  } else {
    channel = "Email";

    reminder = "Daily";

    escalation = "Low";
  }

  return {
    score,

    channel,

    reminder,

    escalation,
  };
}
