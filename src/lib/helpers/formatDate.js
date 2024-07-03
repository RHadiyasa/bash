import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const formatDateToIndonesian = (dateString) => {
  return format(parseISO(dateString), "dd MMMM yyyy - HH:mm", {
    locale: id,
  });
};

export default formatDateToIndonesian;
