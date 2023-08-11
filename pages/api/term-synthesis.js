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
  return `You are grading a submission text based on certain rules represented as json. For each of the items in this json array, check to see if the conditions are met. You can find the specimen piece to be analysed against the rules just after the rules below.

  Rule Definition Structure:

  uuid: This is a unique identifier assigned to each rule. It ensures that each rule is distinguishable and can be referenced when managing or updating rules. Return the same uuid along with the result response.

  skills: This field represents a collection of skills where each skill contains a set of ratingRules to determine the rating based on certain conditions.
    id: An identifier for the skill. This is used to reference the skill when defining rating rules.
    ratingRules: Each skill can have multiple rating rules, each evaluating different conditions. These rules determine the rating assigned to the submission.
      id: A unique identifier for the rating rule.
      rating: The rating to assign if the conditions of this rule are met.
      conditions: Conditions define the criteria that the employee's submission must meet to trigger this rule.
        id: A unique identifier for each condition within the rule.
        terms: The keywords that need to be present in the submission for this condition to be satisfied. 
        The term should exactly match the word in the submission for it to be a hit.
        expression: This is the numeric value or keyword that indicates the degree of success for this condition.



  Description of the submission structure:
  It will be a simple sentence or a paragraph that you will need to grade against the rules above. 
  
  Description of the response structure:
  The response should be a json object with the following:
  uuid: This is the same uuid for the entire rule that was sent in the request.
  skillResults: It is a json array that represents result for each skill that was sent in the request. Each skill should have a result object with the following:
  skillId: The id of the skill that was sent in the request.
  ratingRules: It is a json array that represents result for each rating rule that was sent inside each skill in the request. Each rating rule should have a result object with the following:
  ratingRuleId: The id of the rating rule that was sent in the request.
  conditions: It is a json array that represents result for each condition that was sent inside each rating rule in the request. Each condition should have a result object like the example below:
  "conditions": [
    {
        "hit": "yes", //Whether the condition was met or not. It can be yes or no.
        "score": "100", //A metric that indicates the degree of success for this condition.
        "locations": [ //Array of locations where the condition was met. The same word can be located at multiple places in the submission. It should be also included in the locations array.
            {
                "label": "Sarah", //Label of the term that was matched
                "length": 5, //Length of the term that was matched
                "offset": 5 //Offset of the term that was matched
            }
        ],
        "condition_id": "df2c34c6-e0db-491d-b34f-aab680ffc666" //Condition id that was sent in the request
    }
]
submission: Return back the original submission too in the response.

        `
}

function getRuleDefinitionPrompt(ruleDefinition) {
  return `Here is the rule definition:
  ${ruleDefinition}
  `
}

function getSubmissionPrompt(submission) {
  return `This is the submission that you must grade:
  '${submission}'
  `
}
