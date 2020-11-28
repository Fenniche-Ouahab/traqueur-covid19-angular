import { Component } from '@angular/core';
import { GlobalModel } from './model/global.model';
import { ApiService } from './api/api.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 400,
    navText: [' ', ''],
    responsive: {
      0: {
        items: 1,
      },
      300: {
        items: 2,
      },
      700: {
        items: 3,
      },
      900: {
        items: 4,
      },
    },
    nav: true,
  };

  images = [
    {
      id: 1,
      src: '../assets/gestes/1.png',
      alt: 'Utiliser des mouchoirs à usage unique',
      title: 'Utiliser des mouchoirs à usage unique',
    },
    {
      id: 2,
      src: '../assets/gestes/2.png',
      alt: 'Saluer sans se serrer la main,éviter les embrassades',
      title: 'Saluer sans se serrer la main,éviter les embrassades',
    },
    {
      id: 3,
      src: '../assets/gestes/3.png',
      alt: 'Image_3',
      title: 'Image_3',
    },
    {
      id: 4,
      src: '../assets/gestes/4.png',
      alt: 'Se laver les mains très régulièrement',
      title: 'Se laver les mains très régulièrement',
    },
    {
      id: 5,
      src: '../assets/gestes/5.png',
      alt: 'Tousser ou éternuer dans son coude ou dans un mouchoir',
      title: 'Tousser ou éternuer dans son coude ou dans un mouchoir',
    },
    {
      id: 6,
      src: '../assets/gestes/6.png',
      alt: 'Image_5',
      title: 'Image_5',
    },
    {
      id: 7,
      src: '../assets/gestes/7.png',
      alt: 'Image_5',
      title: 'Image_5',
    },
  ];

  global: boolean;
  country: string;
  data: GlobalModel;
  dailyData: any[];
  countries: any[];
  lineChartData: any[] = [
    {
      data: [65, 64, 33, 44],
      label: 'Temp label',
    },
  ];
  lineChartType = 'line';
  lineChartLabels: any[] = ['Label01', 'Label01', 'Label03'];
  pieChartType = 'pie';
  pieChartLabels: any[] = ['Infectés', 'Rétablis', 'Décès'];
  pieChartData: any[] = [{ data: [65, 76, 33], label: 'Lable' }];

  constructor(private api: ApiService) {
    this.data = new GlobalModel();
  }

  ngOnInit(): void {
    this.global = true;
    this.fetchData();
    this.fetchCountries();
    this.fetchDailyData();
  }

  fetchData() {
    this.api.fetchData().subscribe((res: any[]) => {
      this.data.confiremd = res['confirmed']['value'];
      this.data.recovered = res['recovered']['value'];
      this.data.deaths = res['deaths']['value'];
      this.data.lastupdate = res['lastUpdate'];
    });
  }

  fetchCountries() {
    this.api.fetchCountries().subscribe((res: any[]) => {
      var countries = res['countries'];
      this.countries = countries.map((name) => name['name']);
    });
  }

  fetchDataByCountry(country: string) {
    this.api.fetchDataByCountry(country).subscribe((res: any[]) => {
      this.data.confiremd = res['confirmed']['value'];
      this.data.recovered = res['recovered']['value'];
      this.data.deaths = res['deaths']['value'];
      this.data.lastupdate = res['lastUpdate'];

      this.pieChartData = [
        {
          data: [this.data.confiremd, this.data.recovered, this.data.deaths],
          label: 'People',
        },
      ];
    });
  }

  fetchDailyData() {
    this.api.fetchDailyData().subscribe((res: any[]) => {
      this.lineChartLabels = res.map((date) => date['reportDate']);
      var infectedData = res.map((confirmed) => confirmed['totalConfirmed']);
      var deaths = res.map((deaths) => deaths['deaths']['total']);

      this.lineChartData = [
        {
          data: infectedData,
          label: 'Infectés',
        },
        {
          data: deaths,
          label: 'Décès',
        },
      ];
    });
  }

  countryChanged(value: string) {
    this.country = value;
    if (value == 'global') {
      this.fetchData();
      this.global = true;
    } else {
      this.fetchDataByCountry(value);
      this.global = false;
    }
  }
}
