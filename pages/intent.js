import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';
import Editor from '@monaco-editor/react';

import { defaultRuleDefinition } from '../utils/intentConstants';

export default function Home() {
  const [submission, setSubmission] = useState(`Yes sir, this is acceptable!`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [ruleDefinition, setRuleDefinition] = useState(defaultRuleDefinition);

  async function onSubmit(event) {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch('/api/intent-synthesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruleDefinition,
          submission,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEditorChange = (value, event) => {
    console.log('value:', value);
    console.log('event:', event);
    setRuleDefinition(value);
  };
  // console.log(JSON.parse(result?.content || '[]'));
  return (
    <div>
      <Head>
        <title>Bright with OpenAI</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.controlArea}>
          <form onSubmit={onSubmit}>
            <div>
              <h4>Rule Definition:</h4>
              <div 
                style={{
                  borderRadius: '5px',
                  overflow: 'hidden',
                }}
              >
              <Editor
                height="70vh"
                defaultLanguage="json"
                theme="vs-dark"
                width={600}
                onChange={handleEditorChange}
                value={ruleDefinition}
              
              />
              </div>
            </div>
            <input
              type="text"
              name="submission"
              placeholder="Enter the submission"
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
            />
            <input
              type="submit"
              value={loading ? 'Loading...' : 'Generate'}
            />
          </form>
        </section>
        <section className={styles.resultArea}>
          <pre className={styles.result}>{!loading && result?.content}</pre>
        </section>
      </main>
    </div>
  );
}
