import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
// import utc from 'dayjs/plugin/utc';
import "dayjs/locale/ru";
import "dayjs/locale/en";
import "dayjs/locale/pl";
import "dayjs/locale/uk";
import "dayjs/locale/de";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
// dayjs.extend(utc);

export default dayjs;
