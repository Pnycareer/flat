import { useState } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../hooks/useAuthApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      login(res.user, res.token);
      navigate(from, { replace: true }); // <-- send user back
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589157774617-919700992e4c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0  bg-opacity-60" />

      {/* Login Box */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-white text-center">Welcome Back</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-white mb-1 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-white/80 mt-2">
          Don’t have an account? <a href="/register" className="text-blue-400 hover:underline">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
