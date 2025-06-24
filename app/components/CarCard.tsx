import Link from 'next/link';
import Image from 'next/image';
import styles from './CarCard.module.css';
import { Car } from '../types/car';

interface Props {
  car: Car;
}

const CarCard = (props: Props) => {
  const { car } = props;

  return (
    <Link
      href={`/cars/${car.brand.toLowerCase()}/${car.carModel.toLowerCase().replace(/\s+/g, '-')}-${
        car.year
      }/${car._id}`}
      className={styles.cardLink}
    >
      <div className='card'>
        <div className={styles.imageContainer}>
          <Image
            src={car.image || '/images/car-place-holder.webp'}
            alt={`${car.name}`}
            width={400}
            height={250}
            className={styles.image}
          />
          <div className={styles.badges}>
            <span
              className={`badge ${
                car.status === 'Available'
                  ? 'badge-success'
                  : car.status === 'Coming'
                  ? 'badge-primary'
                  : 'badge-warning'
              }`}
            >
              {car.status}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{car.name}</h3>
            {/* <p className={styles.price}>{formatPrice(car.price)}</p> */}
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>⏲</span>
              <span>{Intl.NumberFormat().format(car.odo)} KM</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>$</span>
              <span>{Intl.NumberFormat().format(car.price)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>⛽</span>
              <span>{car.fuelType}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>🐎</span>
              <span>{120} HP</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
