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

  let carImage = BASE_URL + car.vehicle_images.parts_images.filter((part) => part.part_name === 'Front')?.[0].image;

  if (!carImage) {
    carImage = '/images/car-place-holder.webp';
  }

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Car',
    name: carName,
    vehicleIdentificationNumber: car.description_data['VIN Number'],
    // image: [car.vehicleImage],
    url: typeof window !== 'undefined' ? window.location.href : '',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: car.description_data['price'],
      priceCurrency: 'SAR',
    },
    itemCondition: 'https://schema.org/NewCondition',
    brand: {
      '@type': 'Brand',
      name: car.description_data['Make'],
    },
    model: car.description_data['Model'],
    vehicleConfiguration: car.description_data['Trim/Type'],
    productionDate: car.description_data['Model Year']?.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.description_data['ODO'],
      unitCode: 'SMI',
    },
    color: car.description_data['Exterior Colour'],
    vehicleInteriorColor: car.description_data['Interior Colour'],
    vehicleInteriorType: car.description_data['Upholstery'],
    bodyType: car.description_data['Body Type'],
    driveWheelConfiguration: 'https://schema.org/FourWheelDriveConfiguration',
    vehicleEngine: {
      '@type': 'EngineSpecification',
      fuelType: car.description_data['Fuel Type'],
    },
    vehicleTransmission: car.description_data['Transmission Type'],
    numberOfDoors: car.description_data['Doors'],
    vehicleSeatingCapacity: car.description_data['Seat'],
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const features = Object.entries(car.description_data).filter(([_, value]) => value);
  // const features = Object.entries(car.description_data ?? {}).filter(([key, value]) => Boolean(value));

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className='container'>
        <div className={styles.carDetail}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image src={carImage} alt={carName} width={800} height={500} className={styles.image} priority />
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
              <p className={styles.price}>{Intl.NumberFormat().format(car.description_data['price'] as number)}</p>
            </div>

            <div className={styles.quickSpecs}>
              <div className={styles.specItem}>
                <span className={styles.specKey}>VIN</span>
                <span className={styles.specVal}>{car.description_data['VIN Number'] || 'N/A'}</span>
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
