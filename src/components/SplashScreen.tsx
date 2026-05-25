type SplashScreenProps = {
  isFading?: boolean;
};

export function SplashScreen({ isFading = false }: SplashScreenProps) {
  const logoUrl = '/assets/logo.jpg';

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center px-4 transition-opacity duration-700 ${isFading ? 'opacity-0' : 'opacity-100'
        }`}
    >
      <div className="text-center">
        <img
          src={logoUrl}
          alt="L'Anøv Restaurant"
          className="w-[80vw] max-w-[760px] md:w-[24vw] h-auto object-contain mx-auto"
        />
      </div>
    </div>
  );
}
