export function calculatePriority(deadline, category, description) {
  let score = 0;

  // -----------------------------
  // Deadline Score
  // -----------------------------

  const today = new Date();

  const dueDate = new Date(deadline);

  const diffTime = dueDate - today;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) score += 60;
  else if (diffDays <= 3) score += 40;
  else if (diffDays <= 7) score += 25;
  else score += 10;

  // -----------------------------
  // Category Score
  // -----------------------------

  if (category === "Interview") {
    score += 35;
  } else if (category === "Meeting") {
    score += 30;
  } else if (category === "Bill Payment") {
    score += 25;
  } else if (category === "Assignment") {
    score += 20;
  } else {
    score += 10;
  }

  // -----------------------------
  // Keyword Score
  // -----------------------------

  const text = description.toLowerCase();

  if (text.includes("urgent")) score += 20;

  if (text.includes("important")) score += 15;

  if (text.includes("exam")) score += 20;

  if (text.includes("interview")) score += 20;

  if (text.includes("hackathon")) score += 25;

  if (text.includes("submit")) score += 15;

  if (text.includes("soon")) score += 10;

  if (text.includes("as soon as possible")) score += 20;

  if (text.includes("deadline")) score += 15;

  // -----------------------------
  // Final Priority
  // -----------------------------

  if (score >= 60) return "High";
  else if (score >= 35) return "Medium";

  return "Low";
}
