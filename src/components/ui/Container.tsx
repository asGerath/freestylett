// Este componente será un wrapper reutilizable para centrar contenido
// y controlar el ancho máximo de la app

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {children}
    </div>
  );
}