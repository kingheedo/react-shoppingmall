type Config = {
  username: string,
  password: string,
  database: string,
  host: string,
  [key:string]: string,
}
interface ConfigGroup{
 development: Config;
 test: Config;
 production: Config;
}
 const config: ConfigGroup= {
  "development": { //개발용
    "username": "root",
    "password": process.env.DB_PASSWORD! || '@vlwk9294',
    "database": "react-shoppingmall",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": { //테스트용
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "react-shoppingmall",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": { //배포용
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "react-shoppingmall",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
export default config