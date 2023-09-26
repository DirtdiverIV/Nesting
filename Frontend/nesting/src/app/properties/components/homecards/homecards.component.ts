import { Component, OnInit } from '@angular/core';
import { Properties } from '../../models/properties.model';
import { Router } from '@angular/router';
import { PropertiesService } from '../../service/properties.service';

@Component({
  selector: 'app-homecards',
  templateUrl: './homecards.component.html',
  styleUrls: ['./homecards.component.scss'],
})
export class HomecardsComponent implements OnInit {
  propertyData: Properties[] = [];
  filteredPropertyData: Properties[] = [];
  filters = {
    propertyType: 'Todos',
    city: 'Todas',
    postalCode: 'Todos',
  };

  cities: string[] = [];
  postalCodes: string[] = [];
  selectedCity: string = 'Ciudad';
  selectedPostalCode: string = 'Codigo Postal';
  propertyTypes: string[] = [];
  houseTypes: string[] = [];
  selectedType: string = 'Tipo';
  selectedHouseType: string = 'Tipo de Vivienda';
  selectedPrice: string = 'Precio';
  selectedRooms: string = 'Habitaciones';
  selectedSize: string = 'Tamaño';
  selectedBaths: string = 'Baños';

  constructor(
    private router: Router,
    private propertiesService: PropertiesService
  ) {}

  ngOnInit() {
    this.fetchPropertyData();
  }

  fetchPropertyData() {
    this.propertiesService.getProperties().subscribe(
      (data: Properties[]) => {
        this.propertyData = data;
        this.extractUniqueCitiesAndPostalCodes();
        this.extractUniqueTypes();
        this.extractUniqueHouseTypes();
        this.applyFilters();
        this.applyFilters();
      },
      (error) => {
        console.log('Error fetching properties data: ', error);
      }
    );
  }

  applyFilters() {
    console.log('applyFilters() llamado');
    this.filteredPropertyData = this.propertyData.filter((property) => {
      return (
        (this.selectedType === 'Tipo' || property.type === this.selectedType) &&
        (this.filters.propertyType === 'Todos' ||
          property.type === this.filters.propertyType) &&
        (this.selectedCity === 'Ciudad' ||
          property.city === this.selectedCity) &&
        (this.selectedPostalCode === 'Codigo Postal' ||
          property.postalCode === this.selectedPostalCode) &&
        (this.selectedHouseType === 'Tipo de Vivienda' ||
          property.houseType === this.selectedHouseType) &&
        (this.selectedPrice === 'Precio' ||
          this.isPriceInRange(property.price)) &&
        (this.selectedSize === 'Tamaño' || this.isSizeInRange(property.size)) &&
        (this.selectedRooms === 'Habitaciones' ||
          property.rooms === parseInt(this.selectedRooms)) &&
        (this.selectedBaths === 'Baños' ||
          property.baths === parseInt(this.selectedBaths))
      );
    });
  }

  extractUniqueTypes() {
    this.propertyTypes = [
      ...new Set(this.propertyData.map((property) => property.type)),
    ];
  }

  extractUniqueHouseTypes() {
    this.houseTypes = [
      ...new Set(this.propertyData.map((property) => property.houseType)),
    ];
  }

  updatePropertyTypeFilter(type: string) {
    this.filters.propertyType = type;
    this.applyFilters();
  }

  updateCityFilter(city: string) {
    this.selectedCity = city;
  }

  updatePostalCodeFilter(postalCode: string) {
    this.selectedPostalCode = postalCode;
  }

  extractUniqueCitiesAndPostalCodes() {
    this.cities = [
      ...new Set(this.propertyData.map((property) => property.city)),
    ];
    this.postalCodes = [
      ...new Set(this.propertyData.map((property) => property.postalCode)),
    ];
  }

  updateTypeFilter(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  updateHouseTypeFilter(houseType: string) {
    this.selectedHouseType = houseType;
    this.applyFilters();
  }

  updateSizeFilter(minSize: number, maxSize: number) {
    this.selectedSize = `${minSize} - ${maxSize} m²`;
    this.applyFilters();
  }

  updateRoomsFilter(rooms: number) {
    this.selectedRooms = `${rooms} habitación${rooms > 1 ? 'es' : ''}`;
    this.applyFilters();
  }

  updatePriceFilter(minPrice: number, maxPrice: number) {
    this.selectedPrice = `${minPrice} - ${maxPrice}€`;
    this.applyFilters();
  }

  updateBathsFilter(baths: number) {
    this.selectedBaths = `${baths} baño${baths > 1 ? 's' : ''}`;
    this.applyFilters();
  }

  isPriceInRange(price: number): boolean {
    const [minPriceStr, maxPriceStr] = this.selectedPrice.split(' - ');
    const minPrice = parseFloat(minPriceStr);
    const maxPrice = parseFloat(maxPriceStr);

    return price >= minPrice && price <= maxPrice;
  }

  isSizeInRange(size: number): boolean {
    const [minSizeStr, maxSizeStr] = this.selectedSize.split(' - ');
    const minSize = parseFloat(minSizeStr);
    const maxSize = parseFloat(maxSizeStr);

    return size >= minSize && size <= maxSize;
  }
}
