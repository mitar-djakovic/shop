import Link from 'next/link';
import Image from 'next/image';
import './style.scss';

const Index = () => {
  return (
    <header className="header">
      <div className="nav-left">
        <Link href="/" passHref>
          <div className="home-link">🏠 Home</div>
        </Link>
      </div>
      <div className="cart-container">
        <Link href="/cart" passHref>
          <div className="cart-icon">
            <Image src="/cart.svg" alt="Cart" width={24} height={24} />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Index;
