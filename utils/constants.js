const defaultRuleDefinition = `{
  "uuid": "4b1462c1-afdf-4a6d-9654-6916e9c27e1c",
  "skills": [
    {
      "id": 215,
      "ratingRules": [
        {
          "id": "5a6b0157-7a00-4472-83d4-218a400a3039",
          "rating": 3,
          "conditions": [
            {
              "id": "df2c34c6-e0db-491d-b34f-aab680ffc666",
              "terms": [
                {
                  "term": "test",
                  "caseSensitive": false
                }
              ],
              "subject": "learner_submission",
              "expression": "100"
            }
          ]
        }
      ]
    }
  ],
  "userId": 2101
}
`;

export { defaultRuleDefinition };