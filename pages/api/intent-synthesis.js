import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { submission, ruleDefinition } = req.body || {};
  if (submission.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid submission",
      }
    });
    return;
  }
  if (ruleDefinition.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid rule definition",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages:[
        {"role": "system", "content": createContext()},
        {"role": "user", "content": getRuleDefinitionPrompt(ruleDefinition)},
        {"role": "user", "content": getSubmissionPrompt(submission)},
        // {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        // {"role": "user", "content": "Where was it played?"}
    ],
    });
    console.log('teda => completion.data:', completion.data)
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function createContext() {
  return `
        `
}

function getRuleDefinitionPrompt(ruleDefinition) {
  return `Here is the rule definition:
  ${ruleDefinition}
  `
}

function getSubmissionPrompt(submission) {
  return `this is the submission that you must grade:
  '${submission}'
  `
}
