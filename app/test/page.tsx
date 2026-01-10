'use client'
import axios from 'axios'
import Login from './login'

const page = () => {

  const callApi = async () => {
    const result = await axios.get('/api/posts')
    console.log(result.data, 'result')
  }

  const downloadPdf = async () => {
    try {
      const response = await axios.get('/api/download', {
        responseType: 'blob', // 🔴 IMPORTANT
      })

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'document.pdf'
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download failed', error)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center w-full">
      <Login />

      <button
        className="bg-yellow-300 p-2"
        onClick={callApi}
      >
        call api button
      </button>

      <button
        className="bg-red-400 p-2 ml-2 hover:cursor-pointer"
        onClick={downloadPdf}
      >
        Download PDF
      </button>
    </div>
  )
}

export default page
