interface LogoProps {
  className?: string;
  alt?: string;
  height?: number;
}

const Logo = ({ className, alt = "Realme", height = 32 }: LogoProps) => {
  return <img src="/realme-logo.jpg" alt={alt} className={className} style={{ height }} />;
};

export default Logo;


