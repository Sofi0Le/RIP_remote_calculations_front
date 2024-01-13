import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
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

const CalculationsPage: FC = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('title') || '';
  

  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam);

  const fetchCalculations = (searchText: string) => {
    // Fetch bouquet data using the relative path 
    const filteredCalculations = mockCalculations.filter(calculation =>
      calculation.calculation_name.toLowerCase().includes(searchText.toLowerCase())
    );

    setCalculations(filteredCalculations);

  };

  const breadcrumbsItems = [
    { label: 'Все операции', link:'' } // Link to the current page
  ];

  const handleSearchClick = () => {
    // Redirect to the same frontend page with the search query parameter
    navigateTo(`/calculations/?title=${searchValue}`);
    // Fetch data after navigating to the new URL
    fetchCalculations(searchValue);
  };

  useEffect(() => {
    // Fetch data when the component mounts for the first time or when search query changes
    fetchCalculations(searchValue);
  }, []); // Update the effect to run whenever searchValue changes

  return (
    <div className="album">
      <div className="container">
        <div className="row">
        <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
            <div className="search-bar">
              <input
                type="text"
                id="search-input"
                placeholder="Поиск"
                value={searchValue}
                onChange={(event => setSearchValue(event.target.value))}
              />
              <button type="button" id="search-button" onClick={handleSearchClick}>
                Искать
              </button>
            </div>

            {calculations.map((calculation) => (
            <div className="col" key={calculation.calculation_id}>
              <div className="card">
              <img src={calculation.full_url} alt={calculation.calculation_name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{calculation.calculation_name}</h5>
                  <p className="card-text">{calculation.calculation_description}</p>
                  {/* Add more text elements here if needed */}
                  <a href={`/RIP_remote_calculations_front_pages/#/calculations/${calculation.calculation_id}/`} className="btn btn-primary">
                    Подробнее
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculationsPage;