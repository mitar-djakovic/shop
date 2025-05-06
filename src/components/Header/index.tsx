import Link from 'next/link';
import Image from 'next/image';
import './style.scss';

interface HeaderProps {
  itemCount: number;
}

const Index = ({ itemCount }: HeaderProps) => {
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
            {itemCount > 0 && (
              <div className="cart-item-count">{itemCount}</div> // Display item count if greater than 0
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Index;
