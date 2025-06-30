import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Star, MapPin, User, Search, Menu, Mail, Lock, Phone} from 'lucide-react';
import './App.css';
// Simulación de API - Datos ficticios
// mockProperties: Datos simulados
const mockProperties = [
  {
    id: 1,
    title: "Casa moderna en el centro de Oaxaca",
    location: "Oaxaca, México",
    price: 1200,
    rating: 4.86,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da39262?w=400&h=300&fit=crop"
    ],
    host: "María González",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Cocina", "Estacionamiento", "Aire acondicionado"],
    description: "Hermosa casa moderna ubicada en el corazón de Oaxaca. Perfecta para familias o grupos pequeños que buscan comodidad y ubicación privilegiada."
  },
  {
    id: 2,
    title: "Loft artístico en zona colonial",
    location: "Puebla, México",
    price: 950,
    rating: 4.76,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    ],
    host: "Carlos Mendoza",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Cocina", "Balcón", "Vista panorámica"],
    description: "Loft único con decoración artística en el centro histórico de Puebla. Ideal para parejas que buscan una experiencia cultural auténtica."
  },
  {
    id: 3,
    title: "Habitación acogedora vista jardín",
    location: "Ciudad de México, México",
    price: 800,
    rating: 4.94,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop"
    ],
    host: "Ana Rodríguez",
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Jardín", "Desayuno incluido", "Mascotas permitidas"],
    description: "Habitación tranquila con vista al jardín en una casa familiar. Perfecto para viajeros que buscan una experiencia local auténtica."
  }
];

// Componente de contexto para autenticación
//se usará para proveer y consumir datos r
const AuthContext = React.createContext();//envuelve la aplicación para proveer el contexto

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
//user: guarda los datos del usuario autenticado, para que se vean 
//isLoading: indica si se está verificando si ya hay un usuario guardado
  useEffect(() => {
    // Simular verificación de sesión usando localStorage
    const savedUser = localStorage.getItem('airbnb_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));//, lo convierte de texto a objeto con JSON.parse
    }
    setIsLoading(false);
  }, []);

  const login = (email) => {
    // Simulación de login
    const mockUser = {
      id: 1,
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=ff5a5f&color=fff`
    };
    setUser(mockUser);//convierte un valor de JavaScript (como un objeto o un arreglo) en una cadena JSON (JavaScript Object Notation)
    localStorage.setItem('airbnb_user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);//Devuelve una Promise que se resuelve con el usuario
  };

  const register = (userData) => {
    // Simulación de registro
    //Usa la hora actual como ID único
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=ff5a5f&color=fff`
    };//Se genera una imagen automática con la API de ui-avatars usando su nombre
    setUser(mockUser);// Guarda al nuevo usuario en el estado global
    localStorage.setItem('airbnb_user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);//Elimina el usuario del estado global
    localStorage.removeItem('airbnb_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};//compartiendo globalmente 
//user	Usuario autenticado actual (o null)
//isLoading	Indicador de carga inicial al verificar si ya hay usuario guardado

// Hook personalizado para usar el contexto de autenticación
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};//useAuth. Sirve para acceder fácilmente al contexto de autenticación (AuthContext)
// lanza un error claro si alguien intenta usar useAuth fuera de un <AuthProvider>
// Componente de Header
const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-2xl font-bold text-red-500">airbnb</div>
          </div>

          <div className="hidden md:flex items-center space-x-4 border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
            <input
              type="text"
              placeholder="¿A dónde vas?"
              className="border-none outline-none text-sm"
            />
            <div className="h-6 w-px bg-gray-300"></div>
            <button className="bg-red-500 text-white p-2 rounded-full">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition-shadow"
            >
              <Menu className="w-4 h-4" />
              {user ? (
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Hola, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Iniciar sesión
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente de tarjeta de propiedad
//property: objeto con los datos de una propiedad
//onFavorite: función opcional que se llama cuando el usuario marca o desmarca la propiedad como favorita
// 
const PropertyCard = ({ property, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);//para un pequeño carrusel
  const navigate = useNavigate();// permite cambiar de página

  const handleFavorite = (e) => {//
    e.stopPropagation();//e.stopPropagation() evita que este clic active otros eventos 
    setIsFavorite(!isFavorite);//Si existe onFavorite, la llama con el id de la propiedad y el nuevo estado
    onFavorite?.(property.id, !isFavorite);//solo llama onFavorite si fue proporcionada
  };
//Si ya está en la última, vuelve a la primera (comportamiento circular)
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };
// es el inverso
//Si está en la primera, salta a la última
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className="relative">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white fill-black/20'
            }`}
          />
        </button>

  
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${property.price.toLocaleString()} MXN
          </span>
          <span className="text-sm text-gray-600">por noche</span>
        </div>
      </div>
    </div>
  );
};

// Página principal
// Home: muestra una lista de propiedades
//properties: almacena la lista de propiedades a mostrar
//loading: controla si los datos aún están “cargando”
const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de propiedades solo una vez al montar el componente
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);
//Se llama cuando una tarjeta de propiedad se marca o desmarca como favorita
  const handleFavorite = (propertyId, isFavorite) => {
    console.log(`Propiedad ${propertyId} ${isFavorite ? 'agregada a' : 'removida de'} favoritos`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Encuentra tu próximo destino
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Descubre lugares únicos para hospedarte en todo México
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Alojamientos populares
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Página de detalles de propiedad
const PropertyDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
//Usa el contexto de autenticación
//lmacena la información completa de la propiedad que se va a mostrar
//Controla qué imagen se está mostrando
//Número de huéspedes
  // Simular obtener ID de la URL
  const propertyId = 1; // En una app real esto vendría de useParams()

  useEffect(() => {
    // Simular carga de detalles de propiedad
    //on 500 ms de retardo para dar la sensación de que se está "cargando"
    //id busqueda
    //Luego la guarda en el estado property y desactiva el estado loading
    setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === propertyId);
      setProperty(foundProperty);
      setLoading(false);
    }, 500);
  }, [propertyId]);

  const handleReservation = () => {//Esta función simula el proceso de reserva de la propiedad
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!checkIn || !checkOut) {
      alert('Por favor selecciona las fechas de check-in y check-out');
      return;
    }
    
    alert(`Reservación realizada para ${guests} huésped(es) del ${checkIn} al ${checkOut}`);
  };

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>


        <div className="relative mb-8">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg"
          />
          
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {property.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{property.rating}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-1" />
                <span className="text-gray-600">{property.location}</span>
              </div>
            </div>

            <div className="border-b pb-6 mb-6">
              <div className="flex items-center space-x-6 text-gray-600">
                <span>{property.guests} huéspedes</span>
                <span>{property.bedrooms} habitaciones</span>
                <span>{property.bathrooms} baños</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Anfitrión: {property.host}</h3>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Servicios</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold">
                  ${property.price.toLocaleString()} MXN
                </span>
                <span className="text-gray-600">por noche</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Huéspedes
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {[...Array(property.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} huésped{i > 0 ? 'es' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleReservation}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors font-medium"
              >
                {user ? 'Reservar ahora' : 'Inicia sesión para reservar'}
              </button>

              {checkIn && checkOut && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span>Total estimado:</span>
                    <span className="font-bold">
                      ${(property.price * Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))).toLocaleString()} MXN
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de Login
const Login = () => {// renderiza un formulario de inicio de sesión
  // usa el hook useState para manejar los estados de email, password y loading
  // usa el hook useAuth para acceder a la función de login
  // usa useNavigate y useLocation para redirigir al usuario después de iniciar sesión
  // Si el usuario ya está autenticado, lo redirige a la página desde donde vino o a la raíz
  // Al enviar el formulario, llama a la función login con los datos ingresados
  // Si el login es exitoso, redirige al usuario a la página desde donde vino o a la raíz
  // Si hay un error, muestra una alerta
  // El formulario incluye campos para email y password, con iconos de Mail y Lock respectivamente
  // También incluye un enlace para registrarse si el usuario no tiene cuenta
  // El botón de inicio de sesión muestra un texto diferente si está en proceso de carga
  // También incluye un enlace para registrarse si el usuario no tiene cuenta
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
//ntenta acceder a la propiedad state dentro de location, ?. (Optional chaining)
//perador que permite acceder a propiedades de forma segura, sin que el programa lance error si alguna parte es undefined o null
// || '/' // Si no existe, usa '/' como valor por defecto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {// Intenta iniciar sesión con los datos ingresados
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      alert('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
//placeholder="••••••••" es un texto guia
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-2">airbnb</h2>
          <h1 className="text-2xl font-bold text-gray-900">Inicia sesión</h1>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-red-600 hover:text-red-500"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="tu@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de Registro
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      alert('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-2">airbnb</h2>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-red-600 hover:text-red-500"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Tu nombre completo"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="tu@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <div className="mt-1 relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="+52 1 234 567 8900"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de ruta protegida
//Recibe children: los componentes o elementos que se quieren mostrar solo si el usuario está autorizado
//useAuth() para user y isLoading
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();// useLocation para obtener la ubicación actual

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {//redirige a la página
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente principal de la aplicación
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/property/:id" 
              element={<PropertyDetail />} 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Mis Favoritos
                      </h1>
                      <p className="text-gray-600">
                        Aquí aparecerán las propiedades que hayas marcado como favoritas.
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="*" 
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Página no encontrada</p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Volver al inicio
                    </button>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;