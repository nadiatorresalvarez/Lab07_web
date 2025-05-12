import { useState } from "react";
import { register } from "../services/auth.service";
import { Link } from "react-router-dom";
import "../components/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await register(username, email, password);
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      // Limpiar campos después del registro exitoso
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error al registrar el usuario:", error.response || error);
      setError(
        error.response?.data?.message || "Error al registrar el usuario."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear una cuenta</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
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
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          
          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span><i className="fas fa-spinner fa-spin"></i> Procesando...</span>
            ) : (
              <span><i className="fas fa-user-plus"></i> Registrarse</span>
            )}
          </button>
        </form>
        
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}
        
        <div className="register-footer">
          ¿Ya tienes una cuenta? <Link to="/login" className="login-link">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;