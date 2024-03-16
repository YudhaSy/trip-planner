export class Weather {
    date?: Date;
    iconUrl!: string;
    currentTemp!: string;
    feelsLike!: string;
    minTemp!: string;
    maxTemp!: string;
    humidity!: string;
    description!: string;
    forecastList: Weather[] = [];
}
