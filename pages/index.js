import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()


  useEffect(() => {
    // Redirect to a different URL when visiting "/"
    router.push('/intent');
  }, []);

  return null;
}
