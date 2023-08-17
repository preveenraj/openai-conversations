const defaultRuleDefinition = `[
  {
    "id": 1,
    "intentSamples": [
      "Hi this is Rob calling from TruGreen on a recorded line, how can I help you today?",
      "Hi my name is Jane from TruGreen and I'm looking forward to serving you today - just so you know we're on a recorded line.",
      "Hello there, my name is Ameer and I'm calling from Trugreen on a recorded line. How can I assist you?"
    ],
    "intentExplanation": "this shows use of a name, the company name, and a recorded line."
  },
  {
    "id": 2,
    "intentSamples": [
      "yeah man it’s no big deal.",
      "no problemo I’ve been there.",
      "We’re totally cool with that."
    ],
    "intentExplanation": "this is informal acknowledgement - something like ‘yes sir, this is acceptable’ would be too formal"
  }
]`;

export { defaultRuleDefinition };