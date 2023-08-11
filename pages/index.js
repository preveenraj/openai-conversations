import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [submission, setSubmission] = useState("this is a test");
  const [loading, setLoading] = useState(false); 
  const [result, setResult] = useState();

  async function onSubmit(event) {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submission }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  console.log(JSON.parse(result?.content || '[]'))
  return (
    <div>
      <Head>
        <title>Bright with OpenAI</title>
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
        <input
            type="text"
            name="submission"
            placeholder="Enter the submission"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
        <input type="submit" value={loading ? "Loading..." : "Generate"} />
        </form>
        <pre className={styles.result}>{!loading && result?.content}</pre>
      </main>
    </div>
  );
}
