import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from 'lucide-react';

const Layout = ({ children }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = window.localStorage.getItem('token');
    const usuarioGuardado = window.localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    if (!token && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  // Si aún no estamos en el cliente, no renderizar nada
  if (!isClient) {
    return null;
  }

  // Verificar token una vez que estamos en el cliente
  const token = window.localStorage.getItem('token');
  if (!token && router.pathname !== '/login') {
    return null;
  }

  const navigationLinks = [
    { href: "/", label: "Ver Interconsultas" },
    { href: "/crear-interconsulta", label: "Crear Interconsulta" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo o título */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">
                  Sistema de Interconsultas
                </h1>
              </div>
              {/* Enlaces de navegación desktop */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigationLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                      ${router.pathname === link.href
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <div className="flex items-center">
              {usuario && (
                <div className="mr-4 px-3 py-2 rounded-lg bg-gray-100 text-sm flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <span className="font-medium text-gray-700">
                      {usuario.nombre || usuario.email}
                    </span>
                    <span className="ml-2 text-gray-500 text-xs">
                      {usuario.rol || 'Usuario'}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  window.localStorage.removeItem('token');
                  window.localStorage.removeItem('usuario');
                  router.push('/login');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigationLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    router.pathname === link.href
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                      : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;