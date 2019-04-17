import {
  DefaultPage,
  Service,
  Owner,
  Pet,
} from './';

import {
  Container
} from './components';

export default {
  path: '/',
  name: 'Home',
  component: Container,
  childRoutes: [
    { path: 'default-page',
      name: 'Default page',
      component: DefaultPage,
    },
    { path: 'service', name: 'Service', component: Service, isIndex: true, },
    { path: 'Owner', name: 'Owner', component: Owner },
    { 
      path: 'pet', 
      name: 'Pet', 
      component: Pet, 
      childRoutes: [
        { path: ':id', name: 'Petdetail', component: Pet, isIndex: true }
      ]
    },
  ],
};
