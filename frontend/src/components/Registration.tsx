import { Input } from './ui/input'
import { Button } from './ui/button'
import {  useForm } from 'react-hook-form'
import {useState} from 'react'



interface RegistrationData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function Registration() {

    const { register, handleSubmit } = useForm<RegistrationData>()
    const onSubmit = (data: RegistrationData) => {
      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }
    const [showPassword,setShowPassword] = useState(false);
    const [showCPassword,setShowCPassword] = useState(false);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            {...register('username')}
            className="h-12 border-slate-600 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="h-12 border-slate-600 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text":"password"}
              placeholder="Password"
              {...register('password')}
              className="h-12 border-slate-600 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
                type="button"  // Prevents form submission when clicked
                onClick={() => setShowPassword(!showPassword)}  // Toggle the state
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-white"
            >
                {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showCPassword ? "text":"password"}
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              className="h-12 border-slate-600 bg-slate-800/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            />
            <button
                type="button"  // Prevents form submission when clicked
                onClick={() => setShowCPassword(!showCPassword)}  // Toggle the state
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-white"
            >
                {showCPassword ? '🙈' : '👁️'}
            </button>
          </div>

            <Button  className="h-12 w-full bg-blue-600 text-base font-semibold hover:bg-blue-700">
                Sign Up
            </Button>
        </form>
        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
export default Registration