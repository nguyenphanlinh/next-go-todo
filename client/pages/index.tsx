import { useRouter } from 'next/router'
import Head from 'next/head'
import useTrans from './hooks/useTrans'

export default function Page() {
  const router = useRouter()
  const trans = useTrans()

  return (
    <>
      <Head>
        <title>{trans.home.title}</title>
      </Head>
      <button type="button" onClick={() => router.push('/todo')}>
      {trans.home.bnt}
      </button>
    </>
  )
}