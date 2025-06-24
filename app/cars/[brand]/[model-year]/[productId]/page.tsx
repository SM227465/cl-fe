import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { CarDetails } from '@/app/types/car';

const BASE_URL = 'https://s3.me-south-1.amazonaws.com/storage.siarty.com/storage/auction/images/';

interface CarDetailPageProps {
  params: Promise<{
    brand: string;
    'model-year': string;
    productId: string;
  }>;
}

async function getCarData(productId: string): Promise<CarDetails | null> {
  let carDetails: CarDetails | null;

  try {
    const response = await fetch(`https://car-list-863m.onrender.com/api/v1/cars/${productId}`);

    const data = await response.json();
    carDetails = data?.data;
  } catch (error) {
    console.log(error);

    carDetails = null;
  }

  return carDetails;
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const { productId } = await params;
  const car = await getCarData(productId);

  if (!car) {
    return {
      title: 'Car Not Found - AutoHub',
    };
  }
  const carName = `${car.description_data['Model Year']} ${car.description_data['Make']} ${car.description_data['Model']} ${car.description_data['Trim/Type']}`;

  const title = `${carName} - AutoHub`;
  const description = `${carName} for sale. ${car.description_data['ODO']}} miles, ${
    car.description_data['Fuel Type']
  }, ${car.description_data['price']?.toLocaleString()}. View details and contact seller.`;

  return {
    title,
    description,
    keywords: `${carName}, car for sale, ${car.description_data['Fuel Type']}`,
    openGraph: {
      title,
      description,
      // url: `https://autohub.com/cars/${params.brand}/${params['model-year']}`,
      siteName: 'AutoHub',
      // images: [
      //   {
      //     url: car.image || 'https://autohub.com/placeholder-car.jpg',
      //     width: 1200,
      //     height: 630,
      //     alt: `${car.name}`,
      //   },
      // ],
    },
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { productId } = await params;
  const car = await getCarData(productId);

  if (!car) {
    notFound();
  }

  const carName = `${car.description_data['Model Year']} ${car.description_data['Make']} ${car.description_data['Model']} ${car.description_data['Trim/Type']}`;

  let carImage =
    BASE_URL +
    car.vehicle_images.parts_images.filter((part) => part.part_name === 'Front')?.[0].image;

  if (!carImage) {
    carImage = '/images/car-place-holder.webp';
  }

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Car',
    name: `${carName}`,
    brand: {
      '@type': 'Brand',
      name: car.description_data['Make'],
    },
    model: car.description_data['Model'],
    productionDate: car.description_data['Model Year']?.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.description_data['ODO'],
      unitCode: 'SMI',
    },
    fuelType: car.description_data['Fuel Type'],
    vehicleTransmission: car.description_data['Transmission Type'],
    bodyType: car.description_data['Body Type'],
    color: car.description_data['Exterior Colour'],
    offers: {
      '@type': 'Offer',
      price: car.description_data['price'],
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  const features = Object.entries(car.description_data).filter(([_, value]) => value);

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='container'>
        <div className={styles.carDetail}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image
                src={carImage}
                alt={carName}
                width={800}
                height={500}
                className={styles.image}
                priority
              />
            </div>

            <div className={styles.badges}>
              {/* {car.payment_order_type_status && car.buy_status !== '1' && <span className='badge-warning'>Reserved</span>}

              {car.buy_status === '1' && <span className='badge-primary'>Sold</span>} */}

              {car.buy_status === '1' ? (
                <span className='badge-primary'>Sold</span>
              ) : car.payment_order_type_status && car.buy_status !== '1' ? (
                <span className='badge-warning'>Reserved</span>
              ) : (
                <span className='badge-success'>Available</span>
              )}

              {/* <span
                className={`badge ${
                  car.description_data['disable_status'] === 'Available' ? 'badge-success' : car.status === 'Coming' ? 'badge-primary' : 'badge-warning'
                }`}
              >
                {car.status}
              </span> */}
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>{carName}</h1>
              <p className={styles.price}>{formatPrice(car.description_data?.['price'])}</p>
            </div>

            <div className={styles.quickSpecs}>
              <div className={styles.specItem}>
                <span className={styles.specKey}>VIN</span>
                <span className={styles.specVal}>
                  {car.description_data['VIN Number'] || 'N/A'}
                </span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specKey}>Stock Number</span>
                {/* <span className={styles.specVal}>{car.stockNumber || '1'}</span> */}
              </div>
            </div>
          </div>

          <div className={styles.features}>
            <h2>All Info</h2>
            <div className={styles.featureGrid}>
              {features.map(([label, value], index) => (
                <div key={index} className={styles.featureItem}>
                  <strong>{label}:</strong> <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
