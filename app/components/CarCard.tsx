import Link from 'next/link';
import Image from 'next/image';
import styles from './CarCard.module.css';
import { Car } from '../types/car';

interface Props {
  car: Car;
}

const CarCard = (props: Props) => {
  const { car } = props;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  return (
    <Link
      href={`/cars/${car.brand.toLowerCase()}/${car.model.toLowerCase().replace(/\s+/g, '-')}-${car.year}`}
      className={styles.cardLink}
    >
      <div className='card'>
        <div className={styles.imageContainer}>
          <Image
            src={car.images[0] || '/placeholder-car.jpg'}
            alt={`${car.year} ${car.brand} ${car.model}`}
            width={400}
            height={250}
            className={styles.image}
          />
          <div className={styles.badges}>
            <span
              className={`badge ${
                car.condition === 'new' ? 'badge-success' : car.condition === 'certified' ? 'badge-primary' : 'badge-warning'
              }`}
            >
              {car.condition}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>
              {car.year} {car.brand} {car.model}
            </h3>
            <p className={styles.price}>{formatPrice(car.price)}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>🛣️</span>
              <span>{formatMileage(car.mileage)} miles</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>⛽</span>
              <span>{car.fuelType}</span>
            </div>
            {car.horsepower && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>⚡</span>
                <span>{car.horsepower} HP</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📍</span>
              <span>{car.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
