export function calculateRisk(priority, deadline, category, description) {
  let risk = 0;

  // ---------------------------------------
  // Priority Score
  // ---------------------------------------

  if (priority === "High") {
    risk += 40;
  } else if (priority === "Medium") {
    risk += 25;
  } else {
    risk += 10;
  }

  // ---------------------------------------
  // Deadline Score
  // ---------------------------------------

  const today = new Date();

  // Remove time portion so only dates are compared
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(deadline);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    risk += 35;
  } else if (diffDays <= 3) {
    risk += 25;
  } else if (diffDays <= 7) {
    risk += 15;
  } else {
    risk += 5;
  }

  // ---------------------------------------
  // Category Score
  // ---------------------------------------

  if (category === "Interview") {
    risk += 25;
  } else if (category === "Meeting") {
    risk += 20;
  } else if (category === "Assignment") {
    risk += 15;
  } else if (category === "Bill Payment") {
    risk += 10;
  } else {
    risk += 5;
  }

  // ---------------------------------------
  // Keyword Score
  // ---------------------------------------

  const text = description.toLowerCase();

  if (text.includes("urgent")) {
    risk += 15;
  }

  if (text.includes("important")) {
    risk += 10;
  }

  if (text.includes("submit")) {
    risk += 10;
  }

  if (text.includes("exam")) {
    risk += 20;
  }

  if (text.includes("hackathon")) {
    risk += 20;
  }

  if (text.includes("interview")) {
    risk += 20;
  }

  if (text.includes("deadline")) {
    risk += 15;
  }

  if (text.includes("as soon as possible")) {
    risk += 20;
  }

  // ---------------------------------------
  // Limit Risk Score
  // ---------------------------------------

  risk = Math.min(risk, 100);

  return risk;
}
