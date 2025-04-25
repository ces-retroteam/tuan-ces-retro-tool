
export const deliveryQuestions = [
  {
    id: "delivery_1",
    text: "Commitments",
    description: "How effectively does the team deliver on its commitments?",
    type: "scale",
    required: true,
  },
  {
    id: "delivery_2",
    text: "Quality of Deliverables",
    description: "How would you rate the quality of our deliverables?",
    type: "scale",
    required: true,
  },
  {
    id: "delivery_3",
    text: "Managing Challenges",
    description: "How well does the team handle unexpected obstacles?",
    type: "scale",
    required: true,
  },
];

export const collaborationQuestions = [
  {
    id: "collab_1",
    text: "Communicate",
    description: "How well does the team communicate internally?",
    type: "scale",
    required: true,
  },
  {
    id: "collab_2",
    text: "We before me",
    description: "How effectively do team members support each other?",
    type: "scale",
    required: true,
  },
  {
    id: "collab_3",
    text: "Conflicts.",
    description: "Rate the team's ability to constructively resolve conflicts.",
    type: "scale",
    required: true,
  },
];

export const additionalPrompt = "What are the top 3 challenges facing the team? (Add as many as you'd like)";
