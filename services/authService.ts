interface LoginData {
    email: string;
    password: string;
  }
  
  interface RegisterData extends LoginData {
    name: string;
  }
  
  export const authService = {
    async login(data: LoginData) {
        const response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Login failed');
        }
    
        const result = await response.json();
        return result.data;
      },
  
      async register(data: RegisterData) {
        const response = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Registration failed');
        }
    
        return this.login({
          email: data.email,
          password: data.password
        });
      },
  
    async logout() {
      const response = await fetch('http://localhost:8000/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
  
    async getMe() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/users/me', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to get user data');
        }
    
        const result = await response.json();
        return result.data.user;
      },
  };