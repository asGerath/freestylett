// Este componente será un wrapper reutilizable para centrar contenido
// y controlar el ancho máximo de la app

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}
