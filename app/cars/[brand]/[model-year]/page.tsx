import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { Car } from '@/app/types/car';

interface CarDetailPageProps {
  params: {
    brand: string;
    'model-year': string;
  };
}

// Mock function to fetch car data
async function getCarData(brand: string, modelYear: string): Promise<Car | null> {
  // This would normally fetch from your API
  // For demo purposes, returning mock data
  const [model, year] = modelYear.split('-').slice(0, -1).join('-').split('-').concat(modelYear.split('-').slice(-1));

  return {
    id: '1',
    brand: brand.charAt(0).toUpperCase() + brand.slice(1),
    model: model
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    year: parseInt(year),
    price: 45000,
    mileage: 25000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    horsepower: 350,
    location: 'New York, NY',
    images: ['/placeholder-car.jpg'],
    description: 'This exceptional vehicle combines luxury, performance, and reliability in one stunning package.',
    features: ['Leather Seats', 'Sunroof', 'Navigation System', 'Backup Camera', 'Bluetooth'],
    condition: 'used' as const,
    bodyType: 'Sedan',
    drivetrain: 'AWD',
    exteriorColor: 'Black',
    interiorColor: 'Tan',
    vin: 'WBAPL13C0CA123456',
    stockNumber: 'ST123456',
  };
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const car = await getCarData(params.brand, params['model-year']);

  if (!car) {
    return {
      title: 'Car Not Found - AutoHub',
    };
  }

  const title = `${car.year} ${car.brand} ${car.model} - AutoHub`;
  const description = `${car.year} ${car.brand} ${car.model} for sale. ${car.mileage.toLocaleString()} miles, ${
    car.fuelType
  }, $${car.price.toLocaleString()}. View details and contact seller.`;

  return {
    title,
    description,
    keywords: `${car.brand}, ${car.model}, ${car.year}, car for sale, ${car.fuelType}`,
    openGraph: {
      title,
      description,
      url: `https://autohub.com/cars/${params.brand}/${params['model-year']}`,
      siteName: 'AutoHub',
      images: [
        {
          url: car.images[0] || 'https://autohub.com/placeholder-car.jpg',
          width: 1200,
          height: 630,
          alt: `${car.year} ${car.brand} ${car.model}`,
        },
      ],
    },
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await getCarData(params.brand, params['model-year']);

  if (!car) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Car',
    name: `${car.year} ${car.brand} ${car.model}`,
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    model: car.model,
    productionDate: car.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'SMI',
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    bodyType: car.bodyType,
    color: car.exteriorColor,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className='container'>
        <div className={styles.carDetail}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image
                src={car.images[0] || '/placeholder-car.jpg'}
                alt={`${car.year} ${car.brand} ${car.model}`}
                width={800}
                height={500}
                className={styles.image}
                priority
              />
            </div>

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

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                {car.year} {car.brand} {car.model}
              </h1>
              <p className={styles.price}>{formatPrice(car.price)}</p>
            </div>

            <div className={styles.quickSpecs}>
              <div className={styles.specItem}>
                <span className={styles.specKey}>VIN</span>
                <span className={styles.specVal}>{car.vin || 'N/A'}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specKey}>Stock Number</span>
                <span className={styles.specVal}>{car.stockNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div className={styles.features}>
              <h2>Features</h2>
              <div className={styles.featureGrid}>
                {car.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
