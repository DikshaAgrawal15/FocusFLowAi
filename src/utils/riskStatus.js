export function getRiskStatus(risk) {
  if (risk <= 30) {
    return {
      label: "Safe",
      color: "text-green-400",
    };
  }

  if (risk <= 60) {
    return {
      label: "Moderate",
      color: "text-yellow-400",
    };
  }

  if (risk <= 80) {
    return {
      label: "High",
      color: "text-orange-400",
    };
  }

  return {
    label: "Critical",
    color: "text-red-500",
  };
}
