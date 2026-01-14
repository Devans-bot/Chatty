const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center space-y-8">
        {/* Pattern grid */}
        <div className="grid  grid-cols-3 gap-3 mb-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`
                aspect-square rounded-2xl
                bg-primary/30
                hover:bg-primary/40
                hover:scale-x-95
                hover:animate-pulse
                shadow-lg shadow-primary/20
                motion-safe:animate-pulse
              `}
              style={{
                animationDelay: `${i * 120}ms`, // staggered
              }}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
