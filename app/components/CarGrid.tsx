'use client';
import { useState, useEffect, useCallback } from 'react';
import CarCard from './CarCard';
import styles from './CarGrid.module.css';
import { Car } from '../types/car';

const CarGrid = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCars = useCallback(
    async (pageNum: number) => {
      if (loading) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://car-list-863m.onrender.com/api/v1/cars?page=${pageNum}`
        );
        const data = await response.json();

        if (pageNum === 1) {
          setCars(data.data);
        } else {
          setCars((prev) => {
            const allCars = [...prev, ...data.data];
            const uniqueMap = new Map();
            allCars.forEach((car) => {
              uniqueMap.set(car._id, car);
            });
            return Array.from(uniqueMap.values());
          });
        }

        setHasMore(data.currentPage < data.totalPages);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchCars(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
        fetchCars(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, fetchCars]);

  return (
    <div className={styles.container}>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading more cars...</p>
        </div>
      )}

      {!hasMore && cars.length > 0 && (
        <div className={styles.endMessage}>
          <p>You've reached the end of our listings</p>
        </div>
      )}
    </div>
  );
};

export default CarGrid;
