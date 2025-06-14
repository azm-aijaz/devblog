import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signInWithGoogle, user, signOut } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!user ? (
        <button
          onClick={signInWithGoogle}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-4">Welcome, {user.email}</p>
          <button
            onClick={signOut}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
} 