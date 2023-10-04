import AuthForm from '@/components/AuthForm'

export default function Home() {
  return (
    <div className="flex h-screen relative">
      <div className="flex-1 flex items-center justify-center relative z-10">
        <img
          src="./mic.jpg"
          alt="Microphone"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black"></div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-black p-8 flex-col z-20">
        <img src="./surlogo.jpg" alt="Logo" className="h-1/2 mb-8" />
        <AuthForm />
      </div>
    </div>
  )
}
