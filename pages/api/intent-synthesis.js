import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const { submission, ruleDefinition } = req.body || {};
  if (submission.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid submission',
      },
    });
    return;
  }
  if (ruleDefinition.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid rule definition',
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [
        { role: 'system', content: createContext(ruleDefinition, submission) },
        // { role: 'user', content: getRuleDefinitionPrompt(ruleDefinition) },
        // { role: 'user', content: getSubmissionPrompt(submission) },
        // {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        // {"role": "user", "content": "Where was it played?"}
      ],
    });
    console.log('teda => completion.data:', completion.data);
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function createContext(ruleDefinition, submission) {
  return `
  As a starting point for default Intent Prompt Engineering, let's use:
Assume you are helping a company deliver conversation simulations as part of employee training program. Your role is to help assess whether statements made by employees match the desired intent of the company's training standards.
To conduct the assessment use a 4-star scale. Provide 1 star if the learner shows no alignment with the intent. Provide 2 stars if the learner shows some alignment with the intent, but has opportunities to improve. Provide 3 stars if the learner fully shows the intent. Provide 4 stars if the learner provides an exemplary or outstanding example of the intent.
Using this scale, determine whether the submission below signals the intent indicated by the types of samples below. The samples are separated by periods.
Intent Samples: ${JSON.stringify(ruleDefinition.intentSamples)}
Explanation of Intent: ${ruleDefinition.explanationOfIntent || "No explanation provided."}
Learner Submission: ${JSON.stringify(submission)}
Consistency of your response is essential for the success of this work, so reply using the JSON template below. Do not provide any other commentary outside of the JSON template requested as this will cause system errors for the company you are supporting.
JSON TEMPLATE:
{
  rating: <rating-value>,
  feedback: <feedback-value>
}
        `;
}