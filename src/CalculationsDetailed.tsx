import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './CalculationsDetailed.css';
import './Calculations.css';
import image_1 from '/images/image_1.png'
import image_2 from '/images/image_2.png'
import image_3 from '/images/image_3.jpg'
import image_4 from '/images/image_4.jpg'
import image_5 from '/images/image_5.png'

interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  full_url: string;
}

const mockCalculations: Calculation[] = [
  {
    calculation_id: 1,
    calculation_name: 'НОК',
    calculation_description: 'Наименьшее общее кратное (НОК) двух целых чисел m и n есть наименьшее натуральное число, которое делится на m и n без остатка, то есть кратно им обоим. Пример: HOK(36, 48) = 144.',
    full_url: image_1,
  },
  {
    calculation_id: 2,
    calculation_name: 'Извлечение корня',
    calculation_description: 'Извлечение корня — это алгебраическое действие, обратное возведению в степень. Извлечь корень n-й степени из числа а — это значит найти такое число (или числа) x, которое при возведении в n-ю степень даст данное число (а); число х (обозначается ) называется корнем, n — показателем корня, а — подкоренным выражением.',
    full_url: image_2,
  },
  {
    calculation_id: 3,
    calculation_name: 'Целочисленное деление',
    calculation_description: 'Целочисленное деление - арифметическая операция, результатом которой является целая часть частного, полученного делением одного целого числа на другое целое число.',
    full_url: image_3,
  },
  {
    calculation_id: 4,
    calculation_name: 'Остаток от деления',
    calculation_description: 'Остаток от деления в арифметике  — один из результатов операции деления с остатком. Образуется, если результат деления не может быть выражен целым числом, при этом остаток от деления должен быть по абсолютной величине меньше делителя. В случае, если числа делятся друг на друга без остатка, или нацело, то считают, что остаток равен нулю.',
    full_url: image_4,
  },
  {
    calculation_id: 5,
    calculation_name: 'НОД',
    calculation_description: 'Наибольшим общим делителем (НОД) для двух целых чисел m и n называется наибольший из их общих делителейю.  Пример: для чисел 84 и 90 наибольший общий делитель равен 6. Наибольший общий делитель существует и однозначно определён, если хотя бы одно из чисел m или n не равно нулю.',
    full_url: image_5,
  },

];

const CalculationsDetailedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Accessing the bouquet_id from the URL
  const [calculationData, setCalculationData] = useState<Calculation | null>(null)

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/calculations' },
    { label: 'Подробнее', link: '' } 
  ];

  useEffect(() => {
    if (id) {
      const calculationId = parseInt(id, 10);
      const fetchedCalculationData = mockCalculations.find(calculation => calculation.calculation_id === calculationId);
      if (fetchedCalculationData) {
        setCalculationData(fetchedCalculationData);
      } else {
        console.error(`Calculation with ID ${calculationId} not found`);
      }
    }
  }, [id]);
  

  return (
    <div className="container">
      {
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
          <div className="col">
          {calculationData ? (
            <div className="card">
              <img src={calculationData.full_url} alt={calculationData.calculation_name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{calculationData.calculation_name}</h5>
                <p className="card-text">{calculationData.calculation_description}</p>
              </div>
            </div>
          ) : (
            <p>Загрузка данных...</p>
          )}
          </div>
        </div>
      }
    </div>
  );
};

export default CalculationsDetailedPage;