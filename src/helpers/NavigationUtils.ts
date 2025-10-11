import {indexOf, isEmpty, reduce, startsWith} from 'lodash';
import {Key, pathToRegexp} from 'path-to-regexp';
import parse from 'url-parse';

const DEEPLINK_HOSTNAME = [
  'f99:',
  'f99fruits:',
  'f99.com.vn',
  'm.f99.com.vn',
  'staging.f99.com.vn',
  'dev-f99-node.azurewebsites.net',
];

const routePaths: any = {
  product: '/product/:id',
  preorder: '/preorder/:id',
  listProduct:'/listProduct/:id' ,
  campaign:'/campaign/:id' ,
  listGift: '/f99-partner/gift',
  listFlashSale: '/listFlashSale',
  listGroupBuy: '/listGroupBuy',
  listPreOrder: '/listPreOrder',
  livestreams: '/livestreams',
  none:'/none'
};

const parseRoutePath = (path: string) => {
  DEEPLINK_HOSTNAME.map((hostname: string) => {
    path = path.replace(`/${hostname}`, '');
  });

  for (const key of Object.keys(routePaths)) {
    if (typeof routePaths[key] === 'string') {
      const keys: Key[] = [];
      const regexp = pathToRegexp(routePaths[key], keys);
      const exec = regexp.exec(path);
      if (exec) {
        return {
          routeName: key,
          params: reduce(
            keys,
            (prev: any, item, index: number) => {
              prev[item.name] = exec[index + 1];
              return prev;
            },
            {},
          ),
        };
      }
    }
    if (typeof routePaths[key] === 'object' && Array.isArray(routePaths[key])) {
      for (const route of routePaths[key]) {
        const keys: Key[] = [];
        const regexp = pathToRegexp(route, keys);
        const exec = regexp.exec(path);
        if (exec) {
          return {
            routeName: key,
            params: {
              tab: route.split('/')[1],
              ...reduce(
                keys,
                (prev: any, item, index: number) => {
                  prev[item.name] = exec[index + 1];
                  return prev;
                },
                {},
              ),
            },
          };
        }
      }
    }
  }
  return null;
};
export default class NavigationUtils {
  /**
   * parse data, return routeName and params to go to
   *
   * @param data data to parse
   */
  static parseRoute(routeData: any): any {
    let {link} = routeData;
    if (!link) {
        return {
            routeName: 'url',
            params: {uri: link},
        };
    }

    if (
      link &&
      !startsWith(link, 'https') &&
      !startsWith(link, 'http') &&
      !startsWith(link, '/')
    ) {
      link = 'http://' + link;
    }

    const data = parse(link, true);
    if (!data) {
      return;
    }

    const {host: route, protocol, query: params, pathname, hostname} = data;
    if (protocol === 'http://m.f99.com.vn' || protocol === 'http://staging.f99.com.vn'|| protocol === 'http://m.f99.com.vn' || protocol === 'http:m.f99.com.vn' || isEmpty(hostname)) {
      if (
        isEmpty(hostname) ||
        hostname === 'null' ||
        hostname.indexOf('localhost') >= 0 ||
        indexOf(DEEPLINK_HOSTNAME, hostname) >= 0
      ) {
        let routeParsed;
        if (isEmpty(pathname)) {
          routeParsed = {
            routeName: 'App',
          };
        } else {
          routeParsed = parseRoutePath(pathname.replace(/\/+/gi, '/'));
        }
        // console.log('routeParsed', routeParsed);
        if (routeParsed) {
          let {routeName, params: queryParams} = routeParsed;
          return {
            routeName,
            params: {...params, ...queryParams},
          };
        }
        return {
          routeName: 'url',
          params: {uri: link},
        };
      }
      return {
        routeName: 'url',
        params: {uri: link},
      };
    }

    if (!route) {
      return 'url';
    }
    const routeParsed = parseRoutePath('/' + route + pathname);
    if (routeParsed) {
      const {routeName, params: queryParams} = routeParsed;
      return {
        routeName,
        params: {...params, ...queryParams},
      };
    }

    console.log('routeParsed', route, params);

    return {
      routeName: route,
      params,
    };
  }
}
