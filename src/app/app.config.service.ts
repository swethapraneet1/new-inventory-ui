
import { Injectable, Inject } from '@angular/core';

const appConstants = {
  PROD_ENVIRONMENT: { baseURL: '/', name: 'production' }, //4wlkxgdo6t
  DEV_ENVIRONMENT: { baseURL: 'https://fuel-inventory-backend.onrender.com/api/v1 ', name: 'development' },
  LOCAL_ENVIRONMENT: { baseURL: 'https://fuel-inventory-backend.onrender.com/api/v1/', name: 'local' }
};

@Injectable()
export class AppConfigService {
  env = 'local';

  constructor() {}

  public getBaseURL() {
    if (this.env === appConstants.LOCAL_ENVIRONMENT.name) {
      return appConstants.LOCAL_ENVIRONMENT.baseURL;
    } else if (this.env === appConstants.DEV_ENVIRONMENT.name) {
      return appConstants.DEV_ENVIRONMENT.baseURL;
    } else {
      return appConstants.PROD_ENVIRONMENT.baseURL;
    }
  }
}
