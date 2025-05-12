import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/auth.service";
import "../components/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validaciones del formulario
    if (!username || !password) {
      setError("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(username, password);
      loginContext(response.data);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Error al iniciar sesión.");
      } else {
        setError("No se pudo conectar con el servidor. Verifica tu conexión.");
      }
      console.error("Login failed", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
              <span>Username</span>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordarme</label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span><i className="fas fa-spinner fa-spin"></i> Procesando...</span>
            ) : (
              <span><i className="fas fa-sign-in-alt"></i> Iniciar Sesión</span>
            )}
          </button>
        </form>
        
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <div className="login-footer">
          ¿No tienes una cuenta? <Link to="/register" className="register-link">Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;