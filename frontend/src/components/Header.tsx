interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <header className="bg-gray-800 text-white p-4 shadow-md">
    <h1 className="text-xl font-semibold">{title}</h1>
  </header>
);

export default Header;
